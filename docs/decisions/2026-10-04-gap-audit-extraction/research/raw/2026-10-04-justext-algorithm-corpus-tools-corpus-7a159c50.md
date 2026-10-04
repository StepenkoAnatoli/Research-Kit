---
url: https://corpus.tools/wiki/Justext/Algorithm
retrieved: 2026-10-04
command: firecrawl scrape https://corpus.tools/wiki/Justext/Algorithm --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title:        Justext/Algorithm     – Corpus tools     
---
- [Login](https://corpus.tools/login)
- [Preferences](https://corpus.tools/prefs)

- [Wiki](https://corpus.tools/wiki)

[wiki:](https://corpus.tools/wiki "View WikiStart") [Justext](https://corpus.tools/wiki/Justext "View Justext")/ [Algorithm](https://corpus.tools/wiki/Justext/Algorithm "View Justext/Algorithm")

# jusText algorithm [¶](https://corpus.tools/wiki/Justext/Algorithm\#jusTextalgorithm "Link to this section")

## Introduction [¶](https://corpus.tools/wiki/Justext/Algorithm\#Introduction "Link to this section")

The algorithm uses a simple way of segmentation. The contents of some HTML tags are (by default) visually formatted as blocks by Web browsers. The idea is to form textual blocks by splitting the HTML page on these tags. The full list of the used block-level tags includes: BLOCKQUOTE, CAPTION, CENTER, COL, COLGROUP, DD, DIV, DL, DT, FIELDSET, FORM, H1, H2, H3, H4, H5, H6, LEGEND, LI, OPTGROUP, OPTION, P, PRE, TABLE, TD, TEXTAREA, TFOOT, TH, THEAD, TR, UL. A sequence of two or more BR tags also separates blocks.

Though some of such blocks may contain a mixture of good and boilerplate content, this is fairly rare. Most blocks are homogeneous in this respect.

Several observations can be made about such blocks:

1. Short blocks which contain a link are almost always boilerplate.

2. Any blocks which contain many links are almost always boilerplate.

3. Long blocks which contain grammatical text are almost always good whereas all other long block are almost always boilerplate.

4. Both good (main content) and boilerplate blocks tend to create clusters, i.e. a boilerplate block is usually surrounded by other boilerplate blocks and vice versa.


Deciding whether a text is grammatical or not may be tricky, but a simple heuristic can be used based on the volume of function words (stop words). While a grammatical text will typically contain a certain proportion of function words, few function words will be present in boilerplate content such as lists and enumerations.

The key idea of the algorithm is that long blocks and some short blocks can be classified with very high confidence. All the other short blocks can then be classified by looking at the surrounding blocks.

## Preprocessing [¶](https://corpus.tools/wiki/Justext/Algorithm\#Preprocessing "Link to this section")

In the preprocessing stage, the contents of <header>, <style> and <script> tags are removed. The contents of <select> tags are immediately labeled as bad (boilerplate). The same applies to blocks containing a copyright symbol (©).

## Context-free classification [¶](https://corpus.tools/wiki/Justext/Algorithm\#Context-freeclassification "Link to this section")

After the segmentation and preprocessing, context-free classification is executed which assigns each block to one of four classes:

- bad -- boilerplate blocks

- good -- main content blocks

- short -- too short to make a reliable decision about the class

- near-good -- somewhere in-between short and good


The classification is done by the following algorithm:

The length is the number of characters in the block. The link density is defined as the proportion of characters inside <a> tags. The stop words density is the proportion of stop list words (the text is tokenized into "words" by splitting at spaces).

The algorithm takes two integers LENGHT\_LOW and LENGTH\_HIGH and three floating point numbers MAX\_LINK\_DENSITY, STOPWORDS\_LOW and STOPWORDS\_HIGH as parameters. The former two set the thresholds for dividing the blocks by length into short, medium-size and long. The latter two divide the blocks by the stop words density into low, medium and high. The default settings are:

- MAX\_LINK\_DENSITY = 0.2

- LENGTH\_LOW = 70

- LENGTH\_HIGH = 200

- STOPWORDS\_LOW = 0.30

- STOPWORDS\_HIGH = 0.32


These values give good results with respect to creating textual resources for corpora. They have been determined by performing a number of experiments.

The assignment of classes for the medium and long blocks is summarised in the following table:

| Block size (word count) | stopwords density | class |
| --- | --- | --- |
| medium-size | low | bad |
| long | low | bad |
| medium-size | medium | near-good |
| long | medium | near-good |
| medium-size | high | near-good |
| long | high | good |

## Context-sensitive classification [¶](https://corpus.tools/wiki/Justext/Algorithm\#Context-sensitiveclassification "Link to this section")

The goal of the context-sensitive part of the algorithm is to re-classify the short and near-good blocks either as good or bad based on the classes of the surrounding blocks. The blocks already classified as good or bad serve as base stones in this stage. Their classification is considered reliable and is never changed.

The pre-classified blocks can be viewed as sequences of short and near-good blocks delimited with good and bad blocks. Each such sequence can be surrounded by two good blocks, two bad blocks or by a good block at one side and a bad block at the other. The former two cases are handled easily. All blocks in the sequence are classified as good or bad respectively. In the latter case, a near-good block closest to the bad block serves as a delimiter of the good and bad area. All blocks between the bad block and the near-good block are classified as bad. All the others are classified as good. If all the blocks in the sequence are short (there is no near-good block) they are all classified as bad. This is illustrated on the following example:

The idea behind the context-sensitive classification is that boilerplate blocks are typically surrounded by other boilerplate blocks and vice versa. The near-good blocks usually contain useful corpus data if they occur close to good blocks. The short blocks are typically only useful if they are surrounded by good blocks from both sides. They may, for instance, be a part of a dialogue where each utterance is formatted as a single block. While discarding them may not constitute a loss of significant amount of data, losing the context for the remaining nearby blocks could be a problem.

In the description of the context-sensitive classification, one special case has been intentionally omitted in order to keep it reasonably simple. A sequence of short and near-good blocks may as well occur at the beginning or at the end of the document. This case is handled as if the edges of the documents were bad blocks as the main content is typically located in the middle of the document and the boilerplate near the borders.

## Headings [¶](https://corpus.tools/wiki/Justext/Algorithm\#Headings "Link to this section")

Header blocks (those enclosed in <h1>, <h2>, <h3>, etc tags) are treated in a special way by jusText unless the NO\_HEADINGS option is used. The aim is to preserve headings for the good texts.

The algorithm adds two stages of processing for the header blocks. The first stage (preprocessing) is executed after context-free classification and before context-sensitive classification. The second stage (postprocessing) is performed after the context-sensitive classification:

- context-free classification

- preprocessing of header blocks

- context-sensitive classification

- postprocessing of header blocks


The preprocessing looks for short header blocks which precede good blocks and at the same time there is no more than MAX\_HEADING\_DISTANCE characters between the header block and the good block. The context-free class of such header blocks is changed from short to near-good. The purpose of this is to preserve short blocks between the heading and the good text which might otherwise be removed (classified as bad) by the context-sensitive classification.

The postprocessing again looks for header blocks which precede good blocks and are no further than MAX\_HEADING\_DISTANCE away. This time, the matched headers are classified as good if their context-free class was other than bad. In other words, the bad headings remain bad, but some short and near-good headings can be classified as good if they precede good blocks, even though they would normally be classified as bad by the context-sensitive classification (e.g. they are surrounded by bad blocks). This stage preserves the "non-bad" headings of good blocks.

Note that the postprocessing is not iterative, i.e. the header blocks re-classified as good do not affect the classification of any other preceding header blocks.

[Last modified](https://corpus.tools/wiki/Justext/Algorithm?action=diff&version=2 "Version 2 by admin") 12 years ago
Last modified on 03/24/15 16:12:07


### [Attachments\  (1)](https://corpus.tools/wiki/Justext/Algorithm\#no1)

- [cs\_classification\_example.png](https://corpus.tools/attachment/wiki/Justext/Algorithm/cs_classification_example.png "View attachment") [​](https://corpus.tools/raw-attachment/wiki/Justext/Algorithm/cs_classification_example.png "Download")
(79.5 KB
) \- added by admin12 years ago.


Download all attachments as:
[.zip](https://corpus.tools/zip-attachment/wiki/Justext/Algorithm/)

### Download in other formats:

- [Plain Text](https://corpus.tools/wiki/Justext/Algorithm?format=txt)

![](https://corpus.tools/chrome/site/nlp_logo.png)![](https://corpus.tools/chrome/site/mu_logo.png)[![](https://corpus.tools/chrome/site/lcl_logo.png)](https://lexicalcomputing.com/)
