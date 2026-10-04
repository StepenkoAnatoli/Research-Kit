---
url: https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit
retrieved: 2026-10-04
command: firecrawl scrape https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Systematic Reviews in Elicit | Elicit Help Center
---
[Skip to main content](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#main-content)

# Systematic Reviews in Elicit

The full Systematic Review workflow: setting up your review, gathering papers, screening, extraction, and the final report.

Updated over 2 weeks ago

Table of contents

[How It Works](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_03accd683e)[Set Up Your Review](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_246cd4358e)[Research question](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_6aee67611c)[Additional Context](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_d45ff9addd)[Workflow stages](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_6ccd638847)[Search strategy](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_30bac9c0ab)[Screening depth](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_screening_depth)[Additional settings](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_eb97de3257)[Modifying your setup mid-review](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_d5ead606b2)[Gather Relevant Papers](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_2b335ad674)[Screening](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_11c065a28a)[Data Extraction](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_ffdb903b17)[Research Report](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_87ae98c121)[Other Key Features](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_413b1163bf)

**_Systematic Reviews are available on the Pro, Scale, and Enterprise plans, and each review draws from your plan's monthly usage. See [Usage limits in Elicit](https://support.elicit.com/en/articles/15646622-usage-limits-in-elicit)._**

Elicit can help you save up to 80% of time usually spent on a systematic review without sacrificing accuracy. The Systematic Reviews workflow provides step-by-step guidance through search, screening, and data extraction, culminating in a research report summarizing the relevant papers.

# How It Works

Elicit supports the major steps of a systematic review:

1. Set up your review on the Setup page

2. Gather all papers for the systematic review

3. Screen papers by title and abstract

4. (Optionally) Screen papers by full text

5. Extract data from screened-in papers

6. Generate a research report


# Set Up Your Review

When you start a new systematic review, the first thing you'll see is the **Setup page**. This page shows every step and setting in one place, so everything is configured before anything runs.

![](https://downloads.intercomcdn.com/i/o/sumscdci/2629033783/0f5b7f84c0beb8242a6e6837fad4/Screenshot+2026-08-24+at+5_25_38%E2%80%AFPM.png?expires=1791080100&signature=99c6948a7e930ca4c112f67c1ecbf80f5ca154ffcb0b8d3a5dea5a2a305926c5&req=diYlH8l9noZXWvMW1HO4zeFMu7C9OrdKOsePBMKcJWo6f2eI%2FMXdLXsZtERu%0AD8lYy%2FpMEx2AyVP0A5o%3D%0A)

## Research question

Enter your research question at the top. Elicit uses this to generate search strategies, screening criteria suggestions, extraction column suggestions, and to guide the research report.

This should be a focused research question of two or three sentences at most. Additional context for your review can be entered in the box below. Update your research question at any time by returning to the Setup page.

## Additional Context

Use this free-text field to describe your eligibility criteria, PICO framework, or other setup parameters. For example:

- Population, Intervention, Comparator, Outcome definitions

- Inclusion and exclusion criteria

- Study design requirements (e.g., "RCTs only" or "exclude case reports")


This gives Elicit additional context to apply when suggesting screening criteria and data extraction columns throughout your review.

## Workflow stages

The Setup page displays every stage of your review as a visual timeline. Some stages are always included, and others can be toggled on or off:

**Always on:**

- Gather: to search for papers in Elicit's database, upload papers, or select papers from your Elicit library

- Extraction: to extract data from included papers

- Report: to generate a research report


**Toggleable:**

- Abstract screening: to screen papers by title and abstract. Turn this off to send all gathered papers directly to extraction.

- Full-text screening: an additional screening step using the full paper text. Only available when abstract screening is enabled. Useful when your eligibility criteria require details not found in abstracts.


Disabling abstract screening will also disable full-text screening. Full-text screening cannot run without running abstract screening first.

## Search strategy

Choose how Elicit gathers papers:

- **Semantic search:** Elicit interprets your question and finds conceptually relevant papers. Best for exploratory reviews.

- **Keyword search:** use Boolean strings (AND, OR, NOT) for precise, reproducible searches. Best for PRISMA-compliant reviews or HTA filings.


Note: additional search options, paper uploads, and papers from your library can all be added on the Paper Sources step by clicking the + button.

## Screening depth

Each screening stage runs at a depth you choose, **Fast** or **Thorough**. Fast can handle most reviews. Thorough spends longer and reasons more deeply on each paper before it decides, which takes more time and more of your monthly usage.

Choose Thorough when your criteria are precise. Fast is enough when the title and abstract make the call obvious.

Abstract screening and full-text screening are set independently, so abstracts can run Fast while full texts run Thorough.

## Additional settings

- **Extract from figures:** allow Elicit to analyze figures and images in papers during screening and extraction. _Available on Scale and Enterprise plans, and only once Premium PDF parsing is turned on. Will increase how much usage is required to finish the extraction._

- **Report template:** select the structure and format of your final research report.

- **Dual review:** invite another reviewer to independently make screening decisions in Elicit, on abstract and full-text screening. _Available for Enterprise plans._


**Premium PDF parsing** is not set here. It is an account-wide setting under **Advanced** in your [Account Settings](https://elicit.com/settings), available on every plan except Basic. It handles PDFs with complex formulae, figures, and tables better, and it is what unlocks **Extract from figures**. Because it sends every PDF through a heavier model, it raises the usage of any review you run while it is on, whether or not you extract from figures. See [Usage limits in Elicit](https://support.elicit.com/en/articles/15646622-usage-limits-in-elicit).

## Modifying your setup mid-review

You are not locked into your initial settings. Click the dropdown menu at the top of the page and choose Modify Setup to make changes at any time.

# Gather Relevant Papers

The Gather step consolidates papers into a single systematic review. Elicit initially searches for up to 1,000 papers on your topic. From there, add more searches, delete tabs, upload papers, or select papers from your library. Per systematic review Pro users can add up to 5,000 papers, Scale users up to 20,000 papers, and Enterprise users up to 40,000 papers.

The final report generated at the end of the systematic review workflow includes the 80 papers with the highest screening scores by default. This limit can be extended based on the subscription plan: Pro allows up to 135 papers, and Scale and Enterprise allow up to 200 papers in the final report.

![Gather step screenshot](https://elicit-e64f0748155d.intercom-attachments-1.com/i/o/sumscdci/2317783801/e9ee3ef4c23578d6d4bcb0c7af4a/b650f627-d440-44a1-8d03-6a26a66e3282.png?expires=1791080100&signature=d6f86bea11ced6f6848ee930ddc5a0716d56882f495cb54df8818d82da60a1ef&req=diMmEc52nolfWPMW1HO4zV%2FNtn9JBIVzgNUOXnHmRWAUk9erXZAPRkONP0ku%0Aad3gMOLOEeVWd6%2Bdams%3D%0A)

- **Multi-Tab Search:** Open multiple search tabs using the **+** icon. Combine broad semantic questions with precise Boolean queries simultaneously.

- **Uploads:** Upload PDFs directly or select papers from your Elicit Library.

- **Multiple databases:** Search across Elicit's internal corpus of 138M papers, PubMed, and ClinicalTrials.gov.

- **Removing Automatically Added Papers:** If Elicit adds a search tab with papers it finds relevant, remove it by clicking the **X** on that tab.


Once you've gathered all relevant papers, click "Define screening" to continue.

# Screening

Elicit screens every gathered paper against your criteria. A paper that fails any one of them is excluded, and every decision shows the quote from the paper behind it. Each screening stage runs at Fast or Thorough depth, which you set on the Setup page.

Title and abstract screening runs first, followed by full-text screening if you enabled it on the Setup page.

![Screening screenshot](https://elicit-e64f0748155d.intercom-attachments-1.com/i/o/sumscdci/2317783815/e62108f87f3a8f8247459f3be7ba/430fc8d6-5959-4ed3-99c7-63e240d4fab1.png?expires=1791080100&signature=cd4a4a9c4cb8443e2e23100b511ac94c5bc589b9a9763a7a947ade8c50908711&req=diMmEc52noleXPMW1HO4zUG5SuHxbBW2ombj5PR7hNnrU0TMuUC9y5UOCnmF%0Adxmjdy%2Bdqs2pGYAkMEc%3D%0A)

**Defining criteria:**

- Elicit auto-generates screening criteria based on your research question and setup details

- Edit, disable, or manually add criteria as needed


**Evaluating results:**

- Click **Run screening** when you're satisfied with your criteria

- Excluded papers appear at the bottom of results, each with the criterion it failed and the reason

- Click any paper to see its per-criterion decisions, exclusion reasons, and source quotes from the abstract supporting each decision

- To override a screening decision on a specific paper, click on that paper and then select your decision (Exclude or Include) and then press **Save & next.** Excluding a paper also prompts for an exclusion reason.


![Screening override screenshot](https://elicit-e64f0748155d.intercom-attachments-1.com/i/o/sumscdci/2360697204/b88cc062c92d7b8d052bf188e7cd/b26257d0-cd97-4c4f-b29a-e86c00c72d0f.png?expires=1791080100&signature=fc00920d6c52b60eb1047ca5d2e5a68ce6fb47206b9987ad886544d6009078ad&req=diMhFs93moNfXfMW1HO4zQZHtJALqna6mLZITj%2FBnsHqChftu8Sk3Dtjg9UD%0AT2UpJ5eouW9rH4hgyMg%3D%0A)

**Threshold adjustment:**

Once screening has completed, use the screening threshold slider to include or exclude more papers. Higher thresholds are more selective.

**Full-text Screening:**

If you enabled full-text screening on the Setup page, click the option to continue to full-text screening once abstract screening is complete. Use the [Browser Extension](https://support.elicit.com/en/articles/14759113-elicit-browser-extension) to pull in additional full-text papers for those in your paper set that are abstract-only or upload full text to abstract only papers manually.

![](https://downloads.intercomcdn.com/i/o/sumscdci/2629119410/e3d39278602d7199c481caa22018/Screenshot+2026-08-24+at+6_37_16%E2%80%AFPM.png?expires=1791080100&signature=5f0b5bdcc94db2bb3169f938b0e46af809674bc7137a81d2b6d019854490683f&req=diYlH8h%2FlIVeWfMW1HO4zTMUdb5YgdyTe8VlXteRQpYmC14%2B5FwUm33xBzUJ%0AbnzYegKu%2FXDWvoKfZBY%3D%0A)

**Dual review ( _available on Enterprise plans)_:**

When dual review is enabled, two reviewers can independently make screening decisions in Elicit. Afterwards, Elicit will surface conflicts in screening judgements for reviewers to resolve.

- To enable, turn on "Enable dual review" on the Setup page and add a second reviewer. They'll get an email invite.

- After screening criteria are defined and Elicit generates its decisions, click "Start dual review".

- Each reviewer sees papers and Elicit's recommendations, but not the other's decisions, scores, or notes until both finish.

- Once both finish, a conflict resolution view lists every paper where you disagreed. Discuss and decide on the final screening status of each conflicting paper.

- Audit trail logs every decision, override, and adjudication for PRISMA reconstruction, plus agreement stats (decision agreement, exclusion reason agreement, Cohen's kappa) for both reviewer and Elicit pairs and reviewer to reviewer pairs


# Data Extraction

You'll first define extraction columns on a pilot subset of papers to make sure your columns are functioning as you desire. Elicit generates suggested data extraction columns based on your research question. Edit these suggestions, remove them, or add [your own columns](https://support.elicit.com/en/articles/14758162). **Optimization Tip:** Use plain-English column names that clearly describe the data (e.g., "Number of Reported Studies" instead of "Num\_Studies") to help the model understand the task.

Click "Run extraction" when you're satisfied with your column definitions. Click on any cell in the finished data extraction table to view supporting quotes from the paper and check the AI-generated answers for accuracy.

![Data extraction screenshot](https://elicit-e64f0748155d.intercom-attachments-1.com/i/o/sumscdci/2317783857/d5372cb027035c7ad0e86b47c3e3/2de7fc72-71b4-400f-b264-41ff043f7931.png?expires=1791080100&signature=c441ea5959727e162ca6e72c87bb2a70b9f36dee74e3648e6a5a6dc148d4c375&req=diMmEc52nolaXvMW1HO4zTlc%2FHxPghPHkEkIZvLa2hf8W7hm0giJVrMigWKS%0AYKqe2Ueqc%2F6E8F%2FP02c%3D%0A)

For Scale and Enterprise users, extractions can pull from figures, charts, and diagrams in addition to text, if you turned on **Premium PDF parsing** in your Account Settings and **Extract from figures** on the Setup page. Note that figure extraction uses deeper reasoning and requires a higher usage rate. See [Extracting data from a table or figure](https://support.elicit.com/en/articles/14758168-extracting-data-from-a-table-or-figure-within-a-paper-in-column-answers).

# Research Report

The final step generates a research report summarizing your review. When more than 80 papers are screened in, the 80 papers with the highest screening scores are included in the report. This default limit can be increased with higher-tier plans: Pro allows up to 135 papers, and Scale and Enterprise allow up to 200 papers in the final report.

If you selected a report template on the Setup page, the report will follow that structure.

![Research Report screenshot](https://elicit-e64f0748155d.intercom-attachments-1.com/i/o/sumscdci/2317783879/05263062970790f6a4e4aa2780eb/84697d91-7929-4096-9aee-873421ee6d5d.png?expires=1791080100&signature=98786cd2dab7bf766391d5582c8f8b4c118fcd6ce8c3330335b007d84fc7afde&req=diMmEc52nolYUPMW1HO4zfLWwuH8JLLhI1mQMJJWQYPF%2F%2Bj9DRAgmGFFf15Q%0AmJFMDsDibiHAV9P01fE%3D%0A)

# Other Key Features

- **[Browser Extension](https://support.elicit.com/en/articles/14759113):** Use your institutional database access to pull full texts before data extraction.

- **CSV Export:** Export results from any step for further cleaning or analysis.

- **Collaboration:** Scale and Enterprise plans enable real-time collaborative editing, with a review shared either to named teammates or to your whole team. View-only shareable links are available on all plans.


Systematic Reviews are also sometimes called Systematic Literature Reviews, SRs, or SLRs. They are available on Pro and higher plans.

* * *

Related Articles

- [Get a research report to generate in-depth answers automatically in Elicit](https://support.elicit.com/en/articles/14756862-get-a-research-report-to-generate-in-depth-answers-automatically-in-elicit)
- [Elicit's API](https://support.elicit.com/en/articles/14757400-elicit-s-api)
- [Getting started with Elicit: Which workflow should I use?](https://support.elicit.com/en/articles/14757543-getting-started-with-elicit-which-workflow-should-i-use)
- [Filtering in Elicit](https://support.elicit.com/en/articles/14758171-filtering-in-elicit)
- [Full Text Screening in Elicit Systematic Reviews](https://support.elicit.com/en/articles/14759157-full-text-screening-in-elicit-systematic-reviews)

Did this answer your question?

Disappointed Reaction😞Neutral Reaction😐Smiley Reaction😃

Table of contents

[How It Works](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_03accd683e)[Set Up Your Review](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_246cd4358e)[Research question](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_6aee67611c)[Additional Context](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_d45ff9addd)[Workflow stages](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_6ccd638847)[Search strategy](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_30bac9c0ab)[Screening depth](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_screening_depth)[Additional settings](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_eb97de3257)[Modifying your setup mid-review](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_d5ead606b2)[Gather Relevant Papers](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_2b335ad674)[Screening](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_11c065a28a)[Data Extraction](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_ffdb903b17)[Research Report](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_87ae98c121)[Other Key Features](https://support.elicit.com/en/articles/14759154-systematic-reviews-in-elicit#h_413b1163bf)
