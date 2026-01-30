export type AdmissionLike = {
  Program: string;
  School: string;
  OUACCode?: string | null;
  Average?: number;
};

const INVALID_OUAC_CODES = new Set([
  "",
  "N/A",
  "NA",
  "NONE",
  "NULL",
  "IDK",
  "N\\A",
]);

export function normalizeOuacCode(code?: string | null): string | null {
  if (!code) {
    return null;
  }
  const normalized = code.trim().toUpperCase();
  if (INVALID_OUAC_CODES.has(normalized)) {
    return null;
  }
  return normalized;
}

/**
 * Normalize a program name by stripping common suffixes and variations
 * to help group similar programs together when OUACCode is missing.
 * 
 * E.g., "Computer Science (Co-op)", "Computer Science Honours Coop",
 *       "Honours Computer Science Co-op" → "computer science"
 */
export function normalizeProgramName(program: string): string {
  let normalized = program.toLowerCase().trim();
  
  // Remove common prefixes
  normalized = normalized.replace(/^(bsc|ba|beng|honours?|hon\.?)\s+/gi, "");
  normalized = normalized.replace(/^university of \w+\s+/gi, "");
  
  // Remove common suffixes and parenthetical content
  normalized = normalized.replace(/\s*\([^)]*\)\s*/g, " "); // Remove parentheticals
  normalized = normalized.replace(/\s*(co-?op|coop|honours?|hon\.?|with co-?op|only)\s*/gi, " ");
  normalized = normalized.replace(/\s*-\s*(co-?op|coop)\s*/gi, " ");
  
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();
  
  return normalized;
}

export function buildProgramNameMap(admissions: AdmissionLike[]): Record<string, string> {
  const buckets = new Map<string, Map<string, { count: number; display: string }>>();

  for (const admission of admissions) {
    const code = normalizeOuacCode(admission.OUACCode);
    const rawProgram = admission.Program?.trim();

    if (!code || !rawProgram) {
      continue;
    }

    const normalizedProgram = rawProgram.replace(/\s+/g, " ").trim();
    const key = normalizedProgram.toLowerCase();

    let codeBucket = buckets.get(code);
    if (!codeBucket) {
      codeBucket = new Map();
      buckets.set(code, codeBucket);
    }

    const existing = codeBucket.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      codeBucket.set(key, { count: 1, display: normalizedProgram });
    }
  }

  const programNameMap: Record<string, string> = {};

  buckets.forEach((entries, code) => {
    const entryArray = Array.from(entries.values());
    if (entryArray.length === 0) return;
    
    let best = entryArray[0];
    for (let i = 1; i < entryArray.length; i++) {
      const entry = entryArray[i];
      if (entry.count > best.count) {
        best = entry;
      } else if (entry.count === best.count && entry.display.length < best.display.length) {
        best = entry;
      }
    }
    programNameMap[code] = best.display;
  });

  return programNameMap;
}

export function applyProgramNameMap<T extends AdmissionLike>(admissions: T[]): T[] {
  const programNameMap = buildProgramNameMap(admissions);

  return admissions.map((admission) => {
    const code = normalizeOuacCode(admission.OUACCode);
    const mappedProgram = code ? programNameMap[code] : undefined;

    if (!mappedProgram || mappedProgram === admission.Program) {
      return admission;
    }

    return {
      ...admission,
      Program: mappedProgram,
    };
  });
}

/**
 * Filter out outliers (entries with average below threshold) and 
 * schools with only one entry in the dataset.
 */
export function filterOutliersAndSingleEntrySchools<T extends AdmissionLike>(
  admissions: T[],
  minAverage: number = 60,
  minEntriesPerSchool: number = 2
): T[] {
  // First, filter out entries below minimum average
  const validAdmissions = admissions.filter(a => 
    a.Average !== undefined && a.Average >= minAverage
  );

  // Count entries per school
  const schoolCounts: Record<string, number> = {};
  for (const a of validAdmissions) {
    schoolCounts[a.School] = (schoolCounts[a.School] || 0) + 1;
  }

  // Filter out schools with less than minimum entries
  return validAdmissions.filter(a => 
    schoolCounts[a.School] >= minEntriesPerSchool
  );
}
