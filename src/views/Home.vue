<!--This is the main page with the project and the info and navigation-->>
<template>
  <div class="relative mx-auto max-w-5xl px-4 py-6 pt-24">
    
    <h1 class="mb-2 text-2xl font-semibold md:text-3xl">
      Student Volunteering & Glaucoma Awareness
    </h1>
    <p class="mb-4 text-sm text-slate-300">
      Welcome to Glaucoma Care — a student volunteering platform specifically to help out with glaucoma patients.
    </p>
<!--This section is the contents with the images and gives info on glaucoma and volunteering -->
    <div class="space-y-4">
      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">Why student volunteering matters</h2>
        <p class="mt-2 text-slate-200">
          Student volunteering strengthens communities, improves mental health, and bridges education with careers.
          It helps students build transferable skills such as leadership, teamwork, and communication while creating
          professional networks and improving employability in a competitive job market. It can also enhance your CV.
        </p>
        <img
          src="https://imageio.forbes.com/specials-images/imageserve/65ad49201b8a4682439df59f/Happy-group-of-volunteer-people-showing-importance-of-volunteering-/0x0.jpg?width=960"
          alt="Volunteers working together"
          class="mt-4 w-full rounded-lg border border-slate-800 object-cover md:h-56"
        />
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">
          To begin your volunteer work and acquire additional knowledge, learn more about glaucoma and access resources, articles, and information
        </h2>
        <div class="mt-3 flex flex-col gap-2 text-sm">
          <a
            class="text-indigo-400 hover:text-indigo-300"
            href="https://d1wqtxts1xzle7.cloudfront.net/89670033/10.11648.j.ijovs.20180302.13-libre.pdf?1660544824=&response-content-disposition=inline%3B+filename%3DApproaches_To_Assessing_Students_Learnin.pdf&Expires=1769708722&Signature=ZDvMsYG~ftA6GxVoMa-Vi~18X5tRaCOhktAmFUOoc3yB5sCO~gPmRfhCpLeZBKr3dW~UtxQCmCNjG2QeuSj2TPNZ7bVdkNOtaMcu~5n6oFdcwE3XlJe~AjbT1YqE8dGhqsfUGVxPq47lEjimVLt-qLH7bg93za27rgSynsHyYAD~U4pEgERDd6ZA9XN31AiT61I28u-1RAI893u1GH6szplxpEvrw6H7lUD5IAwsGY~ADvVuiAVO5XFf7zdoah4GenKZ9bHEY0-cFIXaAySWGHxdGJFkO7NToIzLbcXmrO8rJ9EoN28j~HmvIDhkrgMT4lP4JZPWx0089Iw8ObhNlA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA"
            target="_blank"
            rel="noreferrer"
          >
            Supporting PDF: Approaches to Assessing Students’ Learning
          </a>
          <a
            class="text-indigo-400 hover:text-indigo-300"
            href="https://www.nhs.uk/conditions/glaucoma/"
            target="_blank"
            rel="noreferrer"
          >
            NHS: Glaucoma
          </a>
          <a
            class="text-indigo-400 hover:text-indigo-300"
            href="https://www.rnib.org.uk/your-eyes/eye-conditions-az/glaucoma/"
            target="_blank"
            rel="noreferrer"
          >
            RNIB: Glaucoma
          </a>
          <a
            class="text-indigo-400 hover:text-indigo-300"
            href="https://www.voluntarynorfolk.org.uk/unlocking-potential-students-volunteering/"
            target="_blank"
            rel="noreferrer"
          >
            Voluntary Norfolk: Unlocking the potential of students through volunteering
          </a>
          <a
            class="text-indigo-400 hover:text-indigo-300"
            href="https://lifecharity.org.uk/news-and-views/why-volunteering-is-a-must-do-for-students/"
            target="_blank"
            rel="noreferrer"
          >
            Life Charity: Why volunteering is a must‑do for students
          </a>
        </div>
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">Training and resources to get started</h2>
        <p class="mt-2 text-slate-200">
          Watch the short training videos below to build your understanding before you begin volunteering.
        </p>
        <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-black">
            <iframe
              class="h-full w-full"
              src="https://www.youtube.com/embed/cVFzDrmAY78"
              title="Training video 1"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <div class="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-black">
            <iframe
              class="h-full w-full"
              src="https://www.youtube.com/embed/8X1NqEIOy08"
              title="Training video 2"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <div class="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-black">
            <iframe
              class="h-full w-full"
              src="https://www.youtube.com/embed/STz5Xa3ghsU"
              title="Training video 3"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <div class="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-black">
            <iframe
              class="h-full w-full"
              src="https://www.youtube.com/embed/hz7MKn3Gwig"
              title="Training video 4"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">What is glaucoma?</h2>
        <p class="mt-2 text-slate-200">
          Glaucoma is a group of eye conditions that damage the optic nerve.
          This damage is often linked to increased pressure in the eye.
        </p>
        <p class="mt-2 text-slate-200">
          Vision loss from glaucoma is permanent, but early detection can slow or prevent further damage.
        </p>
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">Key facts</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Glaucoma can develop without early symptoms.</li>
          <li>Regular eye tests support early detection.</li>
          <li>Higher risk groups include older adults and people with family history.</li>
        </ul>
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">How this platform works</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Register and log in as a student.</li>
          <li>Complete the glaucoma knowledge quiz.</li>
          <li>Access volunteering tasks in hubs.</li>
          <li>Submit tasks for admin approval.</li>
          <li>Track points and approved hours on your dashboard.</li>
        </ul>

        <p class="mt-3 text-sm text-slate-400">
          Please note, we can only accept applications from those over 18 years old.
        </p>
        <img
          src="https://doctorkerr.com.au/wp-content/uploads/2021/06/diagram-normal-glaucoma-eye.png"
          alt="Normal eye vs glaucoma diagram"
          class="mt-4 w-full rounded-lg border border-slate-800 bg-white object-contain md:h-56"
        />
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">Key reasons to volunteer</h2>
        <ul class="mt-2 list-disc space-y-2 pl-5 text-slate-200">
          <li>
            <strong>Enhances employability & career skills:</strong> 40% of hiring managers consider volunteer work
            on par with paid employment, and volunteering builds practical experience along with problem‑solving and
            time‑management skills.
          </li>
          <li>
            <strong>Improves mental health & well‑being:</strong> Volunteering provides a sense of purpose and can
            reduce stress; research also links it to better physical health such as lower blood pressure.
          </li>
          <li>
            <strong>Networking & social connection:</strong> Students meet professionals, community leaders, and
            like‑minded peers, opening doors to opportunities and friendships.
          </li>
          <li>
            <strong>Personal growth & confidence:</strong> It encourages stepping outside comfort zones, building
            self‑esteem, and gaining deeper self‑awareness.
          </li>
          <li>
            <strong>Community impact:</strong> Students contribute directly to causes they care about (e.g., ecology,
            education, social care), creating tangible change.
          </li>
        </ul>
      </section>
<!--This is the navigation actions for the user authentication -->
      <section class="flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <router-link
          to="/login"
          class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          class="inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Register
        </router-link>
      </section>
    </div>
  </div>
</template>

<script setup>

</script>
