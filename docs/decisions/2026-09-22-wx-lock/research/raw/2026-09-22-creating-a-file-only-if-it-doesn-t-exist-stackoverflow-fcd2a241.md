---
url: https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js
retrieved: 2026-09-22
command: firecrawl scrape https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Creating a file only if it doesn't exist in Node.js - Stack Overflow
---
##### Collectives™ on Stack Overflow

Find centralized, trusted content and collaborate around the technologies you use most.

[Learn more about Collectives](https://stackoverflow.com/collectives)

**Stack Internal**

Knowledge at work

Bring the best of human thought and AI automation together at your work.

[Explore Stack Internal](https://stackoverflow.co/internal/?utm_medium=referral&utm_source=stackoverflow-community&utm_campaign=side-bar&utm_content=explore-teams-compact-popover)

# [Creating a file only if it doesn't exist in Node.js](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js)

[Ask Question](https://stackoverflow.com/questions/ask)

Asked13 years, 11 months ago

Modified [3 years, 11 months ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js?lastactivity "2022-10-24 19:06:50Z")

Viewed
225k times


This question shows research effort; it is useful and clear

127

This question does not show any research effort; it is unclear or not useful

Save this question.

[Timeline](https://stackoverflow.com/posts/12899061/timeline)

Show activity on this post.

We have a buffer we'd like to write to a file. If the file already exists, we need to increment an index on it, and try again. Is there a way to create a file only if it doesn't exist, or should I just stat files until I get an error to find one that doesn't exist already?

For example, I have files `a_1.jpg` and `a_2.jpg`. I'd like my method to try creating `a_1.jpg` and `a_2.jpg`, and fail, and finally successfully create `a_3.jpg`.

The ideal method would look something like this:

```javascript
Copy
fs.writeFile(path, data, { overwrite: false }, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
```

or like this:

```javascript
Copy
fs.createWriteStream(path, { overwrite: false });
```

Does anything like this exist in node's `fs` library?

_EDIT_: My question isn't if there's a separate function that checks for existence. It's this: is there a way to create a file if it doesn't exist, in a single file system call?

- [node.js](https://stackoverflow.com/questions/tagged/node.js "show questions tagged 'node.js'")

[Share](https://stackoverflow.com/q/12899061)

Share a link to this question

Copy link [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/ "The current license for this post: CC BY-SA 3.0")

Short permalink to this question

[Improve this question](https://stackoverflow.com/posts/12899061/edit "")

Follow



Follow this question to receive notifications

[edited Oct 16, 2012 at 16:18](https://stackoverflow.com/posts/12899061/revisions "show all edits to this post")

asked Oct 15, 2012 at 15:36

[![configurator's user avatar](https://www.gravatar.com/avatar/8e93a8053f3e1887a7511aab404c8931?s=64&d=identicon&r=PG)](https://stackoverflow.com/users/9536/configurator)

[configurator](https://stackoverflow.com/users/9536/configurator)

41.9k1414 gold badges8686 silver badges117117 bronze badges

2

- Possible duplicate of [create an empty file in nodejs?](http://stackoverflow.com/questions/12809068/create-an-empty-file-in-nodejs)



valoricDe


–
[valoricDe](https://stackoverflow.com/users/2080707/valoricde "3,264 reputation")



2016-03-15 09:11:49 +00:00

[CommentedMar 15, 2016 at 9:11](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment59665175_12899061)

- Does this answer your question? [Create a file if it doesn't already exist](https://stackoverflow.com/questions/31195391/create-a-file-if-it-doesnt-already-exist)



clickbait


–
[clickbait](https://stackoverflow.com/users/4356188/clickbait "3,028 reputation")



2022-04-07 13:00:43 +00:00

[CommentedApr 7, 2022 at 13:00](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment126853440_12899061)


[Add a comment](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js# "Use comments to ask for more information or suggest improvements. Avoid answering questions in comments.") \| [Expand to show all comments on this post](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js# "Expand to show all comments on this post")

## 8 Answers 8

Sorted by:
[Reset to default](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js?answertab=scoredesc#tab-top)

Highest score (default)

Trending (recent votes count more)

Date modified (newest first)

Date created (oldest first)


This answer is useful

110

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/31777314/timeline)

Show activity on this post.

As your intuition correctly guessed, the naive solution with a pair of `exists / writeFile` calls is wrong. Asynchronous code runs in unpredictable ways. And in given case it is

- Is there a file `a.txt`? — No.
- (File `a.txt` gets created by another program)
- Write to `a.txt` if it's possible. — Okay.

But yes, we can do that in a single call. We're working with file system so it's a good idea to read developer manual on `fs`. And hey, [here's](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback) an interesting part.

> 'w' - Open file for writing. The file is created (if it does not
> exist) or truncated (if it exists).
>
> 'wx' - Like 'w' but fails if path exists.

So all we have to do is just add `wx` to the `fs.open` call. But hey, we don't like `fopen`-like IO. Let's read on `fs.writeFile` a bit more.

> fs.readFile(filename\[, options\], callback)#
>
> filename String
>
> options Object
>
> > encoding String \| Null default = null
> >
> > flag String default = 'r'
>
> callback Function

That `options.flag` looks promising. So we try

```javascript
Copy
fs.writeFile(path, data, { flag: 'wx' }, function (err) {
    if (err) throw err;
    console.log("It's saved!");
});
```

And it works perfectly for a single write. I guess this code will fail in some more bizarre ways yet if you try to solve your task with it. You have an atomary "check for `a_#.jpg` existence, and write there if it's empty" operation, but all the other `fs` state is not locked, and `a_1.jpg` file may spontaneously disappear while you're already checking `a_5.jpg`. Most [\*](https://en.wikipedia.org/wiki/Transactional_NTFS) file systems are no [ACID](https://en.wikipedia.org/wiki/ACID) databases, and the fact that you're able to do at least some atomic operations is miraculous. It's very likely that `wx` code won't work on some platform. So for the sake of your sanity, _use database, finally_.

### Some more info for the suffering

Imagine we're writing something like [`memoize-fs`](https://www.npmjs.com/package/memoize-fs) that caches results of function calls to the file system to save us some network/cpu time. Could we open the file for reading if it exists, and for writing if it doesn't, all in the single call? Let's take a funny look on those flags. After a while of mental exercises we can see that `a+` does what we want: if the file doesn't exist, it creates one and opens it both for reading and writing, and if the file exists it does so without clearing the file (as `w+` would). But now we cannot use it neither in `(smth)File`, nor in `create(Smth)Stream` functions. And that seems like a missing feature.

So feel free to file it as a feature request (or even a bug) to Node.js github, as lack of atomic asynchronous file system API is a drawback of Node. Though [don't expect](https://github.com/joyent/node/issues/7593) changes any time soon.

Edit. I would like to link to articles by [Linus](https://lwn.net/Articles/326505/) and by [Dan Luu](https://danluu.com/file-consistency/) on why exactly you don't want to do anything smart with your `fs` calls, because the claim was left mostly not based on anything.

[Share](https://stackoverflow.com/a/31777314)

Share a link to this answer

Copy link [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/ "The current license for this post: CC BY-SA 4.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/31777314/edit "")

Follow



Follow this answer to receive notifications

[edited Jan 17, 2020 at 0:16](https://stackoverflow.com/posts/31777314/revisions "show all edits to this post")

answered Aug 2, 2015 at 22:36

[![polkovnikov.ph's user avatar](https://i.sstatic.net/2GC1B.jpg?s=64)](https://stackoverflow.com/users/1872046/polkovnikov-ph)

[polkovnikov.ph](https://stackoverflow.com/users/1872046/polkovnikov-ph)

6,66266 gold badges4848 silver badges8383 bronze badges

## Comments

Add a comment

This answer is useful

41

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/44805479/timeline)

Show activity on this post.

What about using the `a` option?

According to [the docs](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback):

> 'a+' - Open file for reading and appending. The file is created if it does not exist.

It seems to work perfectly with `createWriteStream`

[Share](https://stackoverflow.com/a/44805479)

Share a link to this answer

Copy link [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/ "The current license for this post: CC BY-SA 3.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/44805479/edit "")

Follow



Follow this answer to receive notifications

answered Jun 28, 2017 at 14:31

[![Alvaro's user avatar](https://www.gravatar.com/avatar/4da642ebb2987685f30442660dc6751e?s=64&d=identicon&r=PG)](https://stackoverflow.com/users/1081396/alvaro)

[Alvaro](https://stackoverflow.com/users/1081396/alvaro)

41.7k3232 gold badges176176 silver badges355355 bronze badges

## 1 Comment

Add a comment

[![](https://www.gravatar.com/avatar/8e93a8053f3e1887a7511aab404c8931?s=48&d=identicon&r=PG)](https://stackoverflow.com/users/9536/configurator)

configurator

[configurator](https://stackoverflow.com/users/9536/configurator) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment76723620_44805479)

This opens the file even if it exists, which isn't what I want unforunately.

2017-07-02T15:47:01.547Z+00:00

2

Reply

- Copy link

This answer is useful

12

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/29016268/timeline)

Show activity on this post.

**_This method is no longer recommended. fs.exists is deprecated. See comments._**

Here are some options:

1) Have **2 "fs" calls**. The first one is the " **fs.exists**" call, and the second is " **fs.write** / read, etc"

```javascript
Copy
//checks if the file exists.
//If it does, it just calls back.
//If it doesn't, then the file is created.
function checkForFile(fileName,callback)
{
    fs.exists(fileName, function (exists) {
        if(exists)
        {
            callback();
        }else
        {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data)
            {
                callback();
            })
        }
    });
}

function writeToFile()
{
    checkForFile("file.dat",function()
    {
       //It is now safe to write/read to file.dat
       fs.readFile("file.dat", function (err,data)
       {
          //do stuff
       });
    });
}
```

2) Or **Create an empty file** first:

\-\-\- Sync:

```javascript
Copy
//If you want to force the file to be empty then you want to use the 'w' flag:

var fd = fs.openSync(filepath, 'w');

//That will truncate the file if it exists and create it if it doesn't.

//Wrap it in an fs.closeSync call if you don't need the file descriptor it returns.

fs.closeSync(fs.openSync(filepath, 'w'));
```

\-\-\- ASync:

```javascript
Copy
var fs = require("fs");
fs.open(path, "wx", function (err, fd) {
    // handle error
    fs.close(fd, function (err) {
        // handle error
    });
});
```

3) Or use " **touch**": [https://github.com/isaacs/node-touch](https://github.com/isaacs/node-touch)

[Share](https://stackoverflow.com/a/29016268)

Share a link to this answer

Copy link [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/ "The current license for this post: CC BY-SA 4.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/29016268/edit "")

Follow



Follow this answer to receive notifications

[edited Jul 11, 2019 at 18:14](https://stackoverflow.com/posts/29016268/revisions "show all edits to this post")

answered Mar 12, 2015 at 17:19

[![Katie's user avatar](https://www.gravatar.com/avatar/7069459e5a4adfbf0fcb089d25c651c3?s=64&d=identicon&r=PG)](https://stackoverflow.com/users/1696153/katie)

[Katie](https://stackoverflow.com/users/1696153/katie)

49k2020 gold badges105105 silver badges129129 bronze badges

## 1 Comment

Add a comment

[![](https://lh3.googleusercontent.com/-6ylM8SkxZsc/AAAAAAAAAAI/AAAAAAAAHPU/ud5TmwAL__c/s48-rj/photo.jpg)](https://stackoverflow.com/users/4212668/andrew-faulkner)

Andrew Faulkner

[Andrew Faulkner](https://stackoverflow.com/users/4212668/andrew-faulkner) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment52115157_29016268)

**Note that fs.exists is deprecated and no longer recommended for use.** **From the [Node API](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback)**: _checking if a file exists before opening it is an anti-pattern that leaves you vulnerable to race conditions: another process may remove the file between the calls to fs.exists() and fs.open(). Just open the file and handle the error when it's not there. fs.exists() will be deprecated._

2015-08-20T06:17:14.19Z+00:00

13

Reply

- Copy link

This answer is useful

8

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/43059039/timeline)

Show activity on this post.

Todo this in a single system call you can use the `fs-extra` npm module.
After this the file will have been created as well as the directory it is to be placed in.

```javascript
Copy
const fs = require('fs-extra');
const file = '/tmp/this/path/does/not/exist/file.txt'
fs.ensureFile(file, err => {
    console.log(err) // => null
});
```

Another way is to use [ensureFileSync](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile-sync.md) which will do the same thing but synchronous.

```javascript
Copy
const fs = require('fs-extra');
const file = '/tmp/this/path/does/not/exist/file.txt'
fs.ensureFileSync(file)
```

[Share](https://stackoverflow.com/a/43059039)

Share a link to this answer

Copy link [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/ "The current license for this post: CC BY-SA 3.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/43059039/edit "")

Follow



Follow this answer to receive notifications

[edited Apr 6, 2017 at 12:44](https://stackoverflow.com/posts/43059039/revisions "show all edits to this post")

[![Alexis Tyler's user avatar](https://www.gravatar.com/avatar/5f005fa604df97ceeccdd5f7b67d5500?s=64&d=identicon&r=PG)](https://stackoverflow.com/users/2311366/alexis-tyler)

[Alexis Tyler](https://stackoverflow.com/users/2311366/alexis-tyler)

1,02666 gold badges3232 silver badges5252 bronze badges

answered Mar 28, 2017 at 1:19

[![Kumar Vaibhav's user avatar](https://i.sstatic.net/eLeR0.jpg?s=64)](https://stackoverflow.com/users/860563/kumar-vaibhav)

[Kumar Vaibhav](https://stackoverflow.com/users/860563/kumar-vaibhav)

2,64288 gold badges3535 silver badges5656 bronze badges

## 2 Comments

Add a comment

[![](https://www.gravatar.com/avatar/8e93a8053f3e1887a7511aab404c8931?s=48&d=identicon&r=PG)](https://stackoverflow.com/users/9536/configurator)

configurator

[configurator](https://stackoverflow.com/users/9536/configurator) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment73212313_43059039)

Unfortunately this doesn't seem to tell me if the file existed or was created by the operation - it just makes sure it exists after the operation, so I can't know if I should know write to it.

2017-03-28T08:21:42.287Z+00:00

2

Reply

- Copy link

[![](https://www.gravatar.com/avatar/6f24b4b752a9a46700b30c646bb54968?s=48&d=identicon&r=PG)](https://stackoverflow.com/users/1727203/daniel-eagle)

Daniel Eagle

[Daniel Eagle](https://stackoverflow.com/users/1727203/daniel-eagle) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment103733272_43059039)

The fs-extra ensureFileSync function did the trick for me. Now I don't have to write the logic myself.

2019-11-05T22:09:46.78Z+00:00

0

Reply

- Copy link

This answer is useful

4

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/65719638/timeline)

Show activity on this post.

With `async` / `await` and Typescript I would do:

```javascript
Copy
import * as fs from 'fs'

async function upsertFile(name: string) {
  try {
    // try to read file
    await fs.promises.readFile(name)
  } catch (error) {
    // create empty file, because it wasn't found
    await fs.promises.writeFile(name, '')
  }
}
```

[Share](https://stackoverflow.com/a/65719638)

Share a link to this answer

Copy link [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/ "The current license for this post: CC BY-SA 4.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/65719638/edit "")

Follow



Follow this answer to receive notifications

answered Jan 14, 2021 at 13:12

[![Florian Ludewig's user avatar](https://i.sstatic.net/LiFpK.jpg?s=64)](https://stackoverflow.com/users/8586803/florian-ludewig)

[Florian Ludewig](https://stackoverflow.com/users/8586803/florian-ludewig)

6,2261616 gold badges9292 silver badges163163 bronze badges

## 2 Comments

Add a comment

[![](https://www.gravatar.com/avatar/28b32e959ebbbf7e418f96bcd7c1db7e?s=48&d=identicon&r=PG)](https://stackoverflow.com/users/324381/upthecreek)

UpTheCreek

[UpTheCreek](https://stackoverflow.com/users/324381/upthecreek) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment118949998_65719638)

readFile will throw for a number of different reasons, not just a missing file. You should test `error.code === 'ENOENT'`.

2021-04-28T08:00:52.587Z+00:00

4

Reply

- Copy link

[![](https://i.sstatic.net/xJAeOniI.png?s=64)](https://stackoverflow.com/users/181363/jolly-roger)

Jolly Roger

[Jolly Roger](https://stackoverflow.com/users/181363/jolly-roger) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment125118458_65719638)

In addition to @UpTheCreek's point, this is vulnerable to race conditions, plus unnecessarily reads the entire file if it does already exist.

2022-01-19T16:39:50.14Z+00:00

0

Reply

- Copy link

This answer is useful

2

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/73845524/timeline)

Show activity on this post.

Here's a synchronous way of doing it:

```javascript
Copy
try {
    await fs.truncateSync(filepath, 0);
} catch (err) {
    await fs.writeFileSync(filepath, "", { flag: "wx" });
}
```

If the file exists it will get truncated, otherwise it gets created if an error is raised.

[Share](https://stackoverflow.com/a/73845524)

Share a link to this answer

Copy link [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/ "The current license for this post: CC BY-SA 4.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/73845524/edit "")

Follow



Follow this answer to receive notifications

answered Sep 25, 2022 at 15:03

[![Benji's user avatar](https://lh5.googleusercontent.com/-_Ucvd3HnQ7k/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJNkJSfp0aKNay0XAw05ZfuXqI-P5g/s64-rj/photo.jpg)](https://stackoverflow.com/users/13257098/benji)

[Benji](https://stackoverflow.com/users/13257098/benji)

39066 silver badges1313 bronze badges

## 1 Comment

Add a comment

[![](https://lh3.googleusercontent.com/a-/AOh14Ggd-HpVQTOp7nFRwNB1dpBLVc13NT9cywqO3PfF5w=k-s48)](https://stackoverflow.com/users/13079552/andrea-montalbani)

Andrea Montalbani

[Andrea Montalbani](https://stackoverflow.com/users/13079552/andrea-montalbani) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment139168018_73845524)

Does it make sense to await those two functions?

2024-08-30T13:09:11.89Z+00:00

0

Reply

- Copy link

This answer is useful

0

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/12901875/timeline)

Show activity on this post.

You can do something like this:

```javascript
Copy
function writeFile(i){
    var i = i || 0;
    var fileName = 'a_' + i + '.jpg';
    fs.exists(fileName, function (exists) {
        if(exists){
            writeFile(++i);
        } else {
            fs.writeFile(fileName);
        }
    });
}
```

[Share](https://stackoverflow.com/a/12901875)

Share a link to this answer

Copy link [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/ "The current license for this post: CC BY-SA 3.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/12901875/edit "")

Follow



Follow this answer to receive notifications

answered Oct 15, 2012 at 18:36

[![Ivan Lazarevic's user avatar](https://www.gravatar.com/avatar/de2ec0d50acd9ae4d54723de0194e739?s=64&d=identicon&r=PG)](https://stackoverflow.com/users/306272/ivan-lazarevic)

[Ivan Lazarevic](https://stackoverflow.com/users/306272/ivan-lazarevic)

38122 silver badges77 bronze badges

## 5 Comments

Add a comment

[![](https://www.gravatar.com/avatar/8e93a8053f3e1887a7511aab404c8931?s=48&d=identicon&r=PG)](https://stackoverflow.com/users/9536/configurator)

configurator

[configurator](https://stackoverflow.com/users/9536/configurator) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment17504219_12901875)

This is similar to what I've done; I was hoping there was a way to create the file and check for existence in a single fs call.

2012-10-16T16:19:21.68Z+00:00

1

Reply

- Copy link

[![](https://i.sstatic.net/2GC1B.jpg?s=64)](https://stackoverflow.com/users/1872046/polkovnikov-ph)

polkovnikov.ph

[polkovnikov.ph](https://stackoverflow.com/users/1872046/polkovnikov-ph) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment44680469_12901875)

This answer is just wrong. The file could be created in-between the calls to `fs.exists` and `fs.writeFile`.

2015-01-26T16:39:15.973Z+00:00

6

Reply

- Copy link

[![](https://www.gravatar.com/avatar/662cdc6be6cf910c5dd7703722ea9e05?s=48&d=identicon&r=PG)](https://stackoverflow.com/users/785065/loganfsmyth)

loganfsmyth

[loganfsmyth](https://stackoverflow.com/users/785065/loganfsmyth) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment45046577_12901875)

Just to note here, @ebohlman's comment is not necessary, because `fs.exists` is already async and will reset the call stack.

2015-02-05T18:32:50.763Z+00:00

2

Reply

- Copy link

[![](https://i.sstatic.net/2GC1B.jpg?s=64)](https://stackoverflow.com/users/1872046/polkovnikov-ph)

polkovnikov.ph

[polkovnikov.ph](https://stackoverflow.com/users/1872046/polkovnikov-ph) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment45762253_12901875)

@Steve File should be opened with [`wx` rights](http://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback). So the call looks like `fs.writeFile('path', {flag: 'wx'}, function (err, data) { ... })`.

2015-02-26T09:59:23.62Z+00:00

3

Reply

- Copy link

[![](https://i.sstatic.net/2GC1B.jpg?s=64)](https://stackoverflow.com/users/1872046/polkovnikov-ph)

polkovnikov.ph

[polkovnikov.ph](https://stackoverflow.com/users/1872046/polkovnikov-ph) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment45762419_12901875)

A more complicated solution is needed if one needs to open file for reading if it exists, and open for writing if it doesn't (i.e. caching): `ax+`.

2015-02-26T10:03:12.387Z+00:00

1

Reply

- Copy link

Add a comment

This answer is useful

0

This answer is not useful

Save this answer.

Loading when this answer was accepted…

[Timeline](https://stackoverflow.com/posts/74185690/timeline)

Show activity on this post.

This works for me.

```javascript
Copy
// Use the file system fs promises
const {access} = require('fs/promises');

// File Exist returns true
// dont use exists which is no more!
const fexists =async (path)=> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

// Wrapper for your main program
  async function mainapp(){
  if( await fexists("./users.json")){
    console.log("File is here");
  } else {
    console.log("File not here -so make one");
  }
}

// run your program
mainapp();


```

Just keep eye on your async - awaits so everthing plays nice.
hope this helps.

[Share](https://stackoverflow.com/a/74185690)

Share a link to this answer

Copy link [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/ "The current license for this post: CC BY-SA 4.0")

Short permalink to this answer

[Improve this answer](https://stackoverflow.com/posts/74185690/edit "")

Follow



Follow this answer to receive notifications

answered Oct 24, 2022 at 19:06

[![Rag And Bone's user avatar](https://lh3.googleusercontent.com/a-/AOh14GieyG9SYaUUF7Ao8YU7vERrA_5BlKv160xm4Ad5=k-s64)](https://stackoverflow.com/users/16502464/rag-and-bone)

[Rag And Bone](https://stackoverflow.com/users/16502464/rag-and-bone)

122 bronze badges

## 1 Comment

Add a comment

[![](https://i.sstatic.net/WHH2F.png?s=64)](https://stackoverflow.com/users/14267427/tyler2p)

Tyler2P

[Tyler2P](https://stackoverflow.com/users/14267427/tyler2p) [Over a year ago](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js#comment131044880_74185690)

Your answer could be improved by adding more information on what the code does and how it helps the OP.

2022-10-27T14:55:27.887Z+00:00

2

Reply

- Copy link

## Your Answer

**Reminder:** Answers generated by AI tools are not allowed due to Stack Overflow's [artificial intelligence policy](https://stackoverflow.com/help/gen-ai-policy)

Draft saved

Draft discarded

### Sign up or [log in](https://stackoverflow.com/users/login?ssrc=question_page&returnurl=https%3a%2f%2fstackoverflow.com%2fquestions%2f12899061%2fcreating-a-file-only-if-it-doesnt-exist-in-node-js%23new-answer)

Sign up using Google


Sign up using Email and Password


Submit

### Post as a guest

Name

Email

Required, but never shown

Post Your Answer

Discard


By clicking “Post Your Answer”, you agree to our [terms of service](https://stackoverflow.com/legal/terms-of-service/public) and acknowledge you have read our [privacy policy](https://stackoverflow.com/legal/privacy-policy).


Start asking to get answers

Find the answer to your question by asking.

[Ask question](https://stackoverflow.com/questions/ask)

Explore related questions

- [node.js](https://stackoverflow.com/questions/tagged/node.js "show questions tagged 'node.js'")

See similar questions with these tags.

lang-js
