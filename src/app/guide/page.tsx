import React from "react";

const page = () => {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        A guide to your Grade 12 year
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        All the essentials to be successful in your last year of high school!
      </p>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        September to November
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          Start building good life and studying habits now. Sleep is everything.
        </li>
        <li>
          Get involved! This is your last chance to join clubs, teams, council
          which are crucial to having a competitive application.
        </li>
        <li>
          Research into university programs that you may be interested in, take
          online quizzes, attend open house/Q&A sessions
        </li>
        <li>
          Begin to look into common supp app questions (requires lots of thought
          & time but you don't need to figure out the details now)
        </li>
      </ul>

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        November to February
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mb-4 [&>li]:mt-2">
        <li>
          You will receive your OUAC pins to register & apply, usually by
          mid-November
          <ul className="ml-6 list-inside list-disc [&>li]:mt-2">
            <li> You have until early-mid January for equal consideration</li>
            <li>
              {" "}
              Log into your university portals ASAP & start brainstorming for
              any supp apps
            </li>
          </ul>
        </li>
        <li>
          Many programs will begin to offer early admissions starting December
          <ul className="ml-6 list-inside list-disc [&>li]:mt-2">
            <li>
              {" "}
              More competitive programs only start after they see your first
              semester marks February
            </li>
          </ul>
        </li>
        <li>
          <b>
            Start early for supp apps. You want to have fresh eyes on it as many
            times as you can.
          </b>
          <ul className="ml-6 list-inside list-disc [&>li]:mt-2">
            <li>
              Have you submitted an English assignment and were confident in
              your work after looking it over a million times, only to get it
              back with a bunch of silly errors you can't believe you didn't
              notice?
            </li>
            <li>
              Aim to finish your supp app early then put it away for a few days
              or a week before revising
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        February to May
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Congrats, you're half way there!</li>
        <li>
          Something called <i>senioritis</i> will start to devour you. Stay
          focused, your marks likely still matter.
        </li>
        <li>
          Most people will receive their final decisions by mid-May. Some (cough
          cough UofT for '22) waited until the last week of May.
        </li>
        <li>
          After semester 2 midterm marks are locked in, marks don't really
          matter anymore for admission purposes. You can let loose a bit now,
          but don't be reckless.
          <ul className="ml-6 list-inside list-disc [&>li]:mt-2">
            <li>
              It's uncommon but people do get rescinded for not meeting
              conditionals on their offer.
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Mid-May to June
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Accept your offer before June 1</li>
        <li>
          Senioritis cannot be controlled now. Your classes might have 5 people
          in them in June.
        </li>
        <li>
          Most people will receive their final decisions by mid-May. Some (cough
          cough UofT for '22) waited until the last week of May.
        </li>
        <li>
          You're pretty much done! Make the most of your last weeks of high
          school, as you will not see many of these people ever again :'(
        </li>
      </ul>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Choosing a program
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">Coming soon...</p>
    </>
  );
};

export default page;
