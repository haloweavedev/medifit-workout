here’s a super simple, workout-specific blueprint your client can fill in 
(no tech jargon). it shows **what a “Worked” item is** and **which 
variables** they choose, with the **field type** in brackets: `[text]`, 
`[image]`, `[select]` (use `[multi-select]` when more than one choice is 
allowed).

---

# what is a “Worked” item?

a **Worked** item = one **workout program** (e.g., “Muscle Gain – 5 
Days”). it has a listing page (all programs) and a detail page (the 
program with days/exercises).

---

# decisions to make (simple tree)

* **Names & URLs**

  * Plural name: *Workouts* \[text]
  * Singular name: *Workout* \[text]
  * Admin menu label: *Worked* (or *Workouts*) \[text]
  * URL part (slug): `/workouts/` \[text]

* **Listing (archive) page**

  * Show a list page of all programs? Yes/No \[select]
  * How many items per page? \[text]
  * Default sort: Newest / Oldest / A→Z \[select]
  * Filters shown on the list page (pick what you need):

    * Level: Beginner / Intermediate / Advanced \[select]
    * Duration: 3 Days / 5 Days / 8 Weeks… \[select]
    * Type: Mobility, Muscle Gain, Fat Loss, HIIT, CrossFit… 
\[multi-select]
    * Equipment: None, Dumbbells, Barbell, Bands… \[multi-select]
    * Goal: Strength, Fat Loss, Endurance… \[select]

* **What each “Worked” item contains (fields)**

  * Title (program name) \[text]
  * Short summary (one-line hook) \[text]
  * Featured image \[image]
  * Level (e.g., Beginner, Advanced) \[select]
  * Duration (e.g., 3 Days, 5 Days, 8 Weeks) \[select]
  * Type(s) (e.g., Muscle Gain, HIIT) \[multi-select]
  * Estimated session length (e.g., 30–45 min) \[select]
  * Intensity (Low / Medium / High) \[select]
  * Equipment needed \[multi-select]
  * Program description (overview) \[text]
  * Intro video URL (optional) \[text]
  * **Daily plan** (repeat for each day) \[repeater]

    * Day title (e.g., Day 1: Upper Body) \[text]
    * Day summary \[text]
    * **Exercises** (repeat for each exercise) \[repeater]

      * Exercise name \[text]
      * Sets × Reps (e.g., 3 × 10–12) \[text]
      * Rest (e.g., 60–90s) \[text]
      * How-to video URL (optional) \[text]
      * Exercise image (optional) \[image]
  * Extra notes / safety tips \[text]
  * Call-to-action label (e.g., “Start Program”) \[text]

* **Visibility**

  * Public on the website? Yes/No \[select]
  * Show in site search? Yes/No \[select]

---

# client fill-in worksheet (copy/paste)

**1) Names & URLs**

* Plural name: \_\_\_\_\_\_\_\_ \[text]
* Singular name: \_\_\_\_\_\_\_\_ \[text]
* Admin menu label: \_\_\_\_\_\_\_\_ \[text]
* URL slug: `/________/` \[text]

**2) Listing (archive) page**

* List page enabled: Yes / No \[select]
* Items per page: \_\_\_\_\_\_\_\_ \[text]
* Default sort: Newest / Oldest / A→Z \[select]
* Filters to show (tick & list options):

  * Level \[select]: options → \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  * Duration \[select]: options → \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  * Type(s) \[multi-select]: options → 
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  * Equipment \[multi-select]: options → 
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  * Goal \[select]: options → \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**3) Fields for each “Worked” (workout program)**

* Short summary \[text]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Featured image \[image]: (we’ll upload)
* Level \[select]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Duration \[select]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Type(s) \[multi-select]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Estimated session length \[select]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Intensity \[select]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Equipment needed \[multi-select]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Program description \[text]: 
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
* Intro video URL (optional) \[text]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Daily plan** (add as many days as needed):

* **Day \_\_**

  * Day title \[text]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  * Day summary \[text]: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  * **Exercises** (add rows):

    * Exercise name \[text] | Sets × Reps \[text] | Rest \[text] | Video 
URL \[text] | Image \[image]

**4) Visibility**

* Public: Yes / No \[select]
* In site search: Yes / No \[select]

---

# example 1 (beginner, muscle gain – 5 days)

**1) Names & URLs**

* Plural: Workouts | Singular: Workout | Menu: Worked | Slug: `/workouts/`

**2) Listing**

* Enabled, 12 per page, sort Newest
* Filters:

  * Level → Beginner, Advanced
  * Duration → 3 Days, 5 Days
  * Type → Mobility, Muscle Gain, Fat Loss, HIIT, CrossFit
  * Equipment → None, Dumbbells
  * Goal → Strength, Fat Loss

**3) Fields (this program)**

* Title: Muscle Gain – 5 Days \[text]
* Short summary: Build lean muscle with a simple split. \[text]
* Featured image: (hero photo) \[image]
* Level: Beginner \[select]
* Duration: 5 Days \[select]
* Type(s): Muscle Gain \[multi-select]
* Session length: 45 min \[select]
* Intensity: Medium \[select]
* Equipment: Dumbbells \[multi-select]
* Description: A 5-day plan alternating upper/lower/core. \[text]
* Intro video URL: https\://… \[text]

**Daily plan (sample)**

* **Day 1** – Upper Body \[text]

  * Exercises:

    * Pull-Ups | 3 × 8–12 | 60–90s | https\://… | \[image]
    * Push-Ups | 3 × 10–15 | 60s | https\://… | \[image]
* **Day 2** – Lower Body \[text]

  * Exercises:

    * Squats | 4 × 12–15 | 90s | https\://… | \[image]
    * Lunges | 3 × 12/leg | 60s | https\://… | \[image]
      (continue through Day 5…)

**4) Visibility**

* Public: Yes | In search: Yes

---

# example 2 (beginner, mobility – 3 days)

**Listing filters** (same as above)

**Fields (this program)**

* Title: Mobility & Flexibility – 3 Days \[text]
* Short summary: Gentle routines to improve range of motion. \[text]
* Featured image: \[image]
* Level: Beginner \[select]
* Duration: 3 Days \[select]
* Type(s): Mobility \[multi-select]
* Session length: 25–30 min \[select]
* Intensity: Low \[select]
* Equipment: None, Yoga mat \[multi-select]
* Description: Stretching and light flows to reduce stiffness. \[text]
* Intro video URL: https\://… \[text]

**Daily plan (sample)**

* **Day 1** – Full-Body Flow

  * Cat-Cow | 3 × 8 | 30s | https\://… | \[image]
  * Hip Flexor Stretch | 2 × 45s/side | 30s | https\://… | \[image]
* **Day 2** – Lower-Body Mobility

  * Hamstring Sweep | 2 × 60s/side | 30s | https\://… | \[image]
* **Day 3** – Shoulders & T-Spine

  * Wall Slides | 3 × 10 | 45s | https\://… | \[image]

---

### tips

* anything you want to **filter on the listing page** should be a 
**\[select] or \[multi-select]** (Level, Duration, Type, Equipment).
* if something repeats (Days, Exercises), we’ll set it up as a 
**repeatable group** so you can add as many as you like.

paste the filled **worksheet** back to us, and we’ll build the backend to 
match exactly.

