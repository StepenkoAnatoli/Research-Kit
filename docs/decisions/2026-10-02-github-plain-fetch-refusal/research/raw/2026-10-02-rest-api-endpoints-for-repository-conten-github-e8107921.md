---
url: https://docs.github.com/en/rest/repos/contents
retrieved: 2026-10-02
command: http-keyless scrape https://docs.github.com/en/rest/repos/contents
statusCode: 200
transport: http-keyless
completeness: partial
omitted: 2 sibling section(s) totalling ~30 words were outside the page's main content and are not in this capture
title: REST API endpoints for repository contents - GitHub Docs
---
In this article

 The REST API is now versioned. For more information, see "[About API versioning](/rest/overview/api-versions)."



# REST API endpoints for repository contents

 Use the REST API to create, modify, and delete Base64 encoded content in a repository.



## [Get repository content](#get-repository-content)

 Gets the contents of a file or directory in a repository. Specify the file path or directory with the `path` parameter. If you omit the `path` parameter, you will receive the contents of the repository's root directory.

 This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."



- **`application/vnd.github.raw+json`**: Returns the raw file contents for files and symlinks.

- **`application/vnd.github.html+json`**: Returns the file contents in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).

- **`application/vnd.github.object+json`**: Returns the contents in a consistent object format regardless of the content type. For example, instead of an array of objects for a directory, the response will be an object with an `entries` attribute containing the array of objects.

 If the content is a directory: The response will be an array of objects, one object for each item in the directory.

 If the content is a symlink and the symlink's target is a normal file in the repository, then the API responds with the content of the file. Otherwise, the API responds with an object describing the symlink itself.

 If the content is a submodule, the `submodule_git_url` field identifies the location of the submodule repository, and the `sha` identifies a specific commit within the submodule repository. Git uses the given URL when cloning the submodule repository, and checks out the submodule at that specific commit. If the submodule repository is not hosted on github.com, the Git URLs (`git_url` and `_links["git"]`) and the github.com URLs (`html_url` and `_links["html"]`) will have null values.

 **Notes**:



- To get a repository's contents recursively, you can [recursively get the tree](https://docs.github.com/rest/git/trees#get-a-tree).

- This API has an upper limit of 1,000 files for a directory. If you need to retrieve
more files, use the [Git Trees API](https://docs.github.com/rest/git/trees#get-a-tree).

- Download URLs expire and are meant to be used just once. To ensure the download URL does not expire, please use the contents API to obtain a fresh download URL for each download.

- If the requested file's size is:

 1 MB or smaller: All features of this endpoint are supported.

- Between 1-100 MB: Only the `raw` or `object` custom media types are supported. Both will work as normal, except that when using the `object` media type, the `content` field will be an empty
string and the `encoding` field will be `"none"`. To get the contents of these larger files, use the `raw` media type.

- Greater than 100 MB: This endpoint is not supported.



### [Fine-grained access tokens for "Get repository content"](#get-repository-content--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have the following permission set:


- "Contents" repository permissions (read)

 This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Get repository content"](#get-repository-content--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |
| `path` string Required path parameter |

 Query parameters
| Name, Type, Description |
| `ref` string The name of the commit/branch/tag. Default: the repository’s default branch. |

### [HTTP response status codes for "Get repository content"](#get-repository-content--status-codes)


| Status code | Description |
| `200` | OK |
| `302` | Found |
| `304` | Not modified |
| `403` | Forbidden |
| `404` | Resource not found |



### [Code samples for "Get repository content"](#get-repository-content--code-samples)

#### Request examples

 Select the example type Content is a file using the object media type (application/vnd.github.object) Content is a directory using the object media type (application/vnd.github.object) Content is a file (application/json) Content is a directory (application/json) Content is a symlink (application/json) Content is a submodule (application/json)

 get /repos /{owner} /{repo} /contents /{path}


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -H "Accept: application/vnd.github.object" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/contents/PATH`

#### Response if content is a file


- Example response
- Response schema

 `Status: 200`

 `{
 "type": "file",
 "encoding": "base64",
 "size": 5362,
 "name": "README.md",
 "path": "README.md",
 "content": "IyBZb2dhIEJvmsgaW4gcHJvZ3Jlc3MhIEZlZWwgdAoKOndhcm5pbmc6IFdvc\\nZnJlZSBmUgdG8gY0byBjaGVjayBvdXQgdGhlIGFwcCwgYnV0IGJlIHN1c29t\\nZSBiYWNrIG9uY2UgaXQgaXMgY29tcGxldGUuCgpBIHdlYiBhcHAgdGhhdCBs\\nZWFkcyB5b3UgdGhyb3VnaCBhIHlvZ2Egc2Vzc2lvbi4KCltXb3Jrb3V0IG5v\\ndyFdKGh0dHBzOi8vc2tlZHdhcmRzODguZ2l0aHViLmlvL3lvZ2EvKQoKPGlt\\nZyBzcmM9InNyYy9pbWFnZXMvbWFza2FibGVfaWNvbl81MTIucG5nIiBhbHQ9\\nImJvdCBsaWZ0aW5nIHdlaWdodHMiIHdpZHRoPSIxMDAiLz4KCkRvIHlvdSBo\\nYXZlIGZlZWRiYWNrIG9yIGlkZWFzIGZvciBpbXByb3ZlbWVudD8gW09wZW4g\\nYW4gaXNzdWVdKGh0dHBzOi8vZ2l0aHViLmNvbS9za2Vkd2FyZHM4OC95b2dh\\nL2lzc3Vlcy9uZXcpLgoKV2FudCBtb3JlIGdhbWVzPyBWaXNpdCBbQ25TIEdh\\nbWVzXShodHRwczovL3NrZWR3YXJkczg4LmdpdGh1Yi5pby9wb3J0Zm9saW8v\\nKS4KCiMjIERldmVsb3BtZW50CgpUbyBhZGQgYSBuZXcgcG9zZSwgYWRkIGFu\\nIGVudHJ5IHRvIHRoZSByZWxldmFudCBmaWxlIGluIGBzcmMvYXNhbmFzYC4K\\nClRvIGJ1aWxkLCBydW4gYG5wbSBydW4gYnVpbGRgLgoKVG8gcnVuIGxvY2Fs\\nbHkgd2l0aCBsaXZlIHJlbG9hZGluZyBhbmQgbm8gc2VydmljZSB3b3JrZXIs\\nIHJ1biBgbnBtIHJ1biBkZXZgLiAoSWYgYSBzZXJ2aWNlIHdvcmtlciB3YXMg\\ncHJldmlvdXNseSByZWdpc3RlcmVkLCB5b3UgY2FuIHVucmVnaXN0ZXIgaXQg\\naW4gY2hyb21lIGRldmVsb3BlciB0b29sczogYEFwcGxpY2F0aW9uYCA+IGBT\\nZXJ2aWNlIHdvcmtlcnNgID4gYFVucmVnaXN0ZXJgLikKClRvIHJ1biBsb2Nh\\nbGx5IGFuZCByZWdpc3RlciB0aGUgc2VydmljZSB3b3JrZXIsIHJ1biBgbnBt\\nIHN0YXJ0YC4KClRvIGRlcGxveSwgcHVzaCB0byBgbWFpbmAgb3IgbWFudWFs\\nbHkgdHJpZ2dlciB0aGUgYC5naXRodWIvd29ya2Zsb3dzL2RlcGxveS55bWxg\\nIHdvcmtmbG93Lgo=\\n",
 "sha": "3d21ec53a331a6f037a91c368710b99387d012c1",
 "url": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
 "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
 "html_url": "https://github.com/octokit/octokit.rb/blob/master/README.md",
 "download_url": "https://raw.githubusercontent.com/octokit/octokit.rb/master/README.md",
 "_links": {
 "git": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
 "self": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
 "html": "https://github.com/octokit/octokit.rb/blob/master/README.md"
 }
}`



## [Create or update file contents](#create-or-update-file-contents)

 Creates a new file or replaces an existing file in a repository.

 Note


If you use this endpoint and the "[Delete a file](https://docs.github.com/rest/repos/contents/#delete-a-file)" endpoint in parallel, the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead.

 OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint. The `workflow` scope is also required in order to modify files in the `.github/workflows` directory.

### [Fine-grained access tokens for "Create or update file contents"](#create-or-update-file-contents--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have at least one of the following permission sets:


- "Contents" repository permissions (write)
- "Contents" repository permissions (write) and "Workflows" repository permissions (write)

### [Parameters for "Create or update file contents"](#create-or-update-file-contents--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |
| `path` string Required path parameter |

 Body parameters
| Name, Type, Description |
| `message` string Required The commit message. |
| `content` string Required The new file content, using Base64 encoding. |
| `sha` string **Required if you are updating a file**. The blob SHA of the file being replaced. |
| `branch` string The branch name. Default: the repository’s default branch. |
| `committer` object The person that committed the file. Default: the authenticated user. |
| Properties of `committer` Name, Type, Description |
| `name` string Required The name of the author or committer of the commit. You'll receive a `422` status code if `name` is omitted. |
| `email` string Required The email of the author or committer of the commit. You'll receive a `422` status code if `email` is omitted. |
| `date` string |


| `author` object The author of the file. Default: The `committer` or the authenticated user if you omit `committer`. |
| Properties of `author` Name, Type, Description |
| `name` string Required The name of the author or committer of the commit. You'll receive a `422` status code if `name` is omitted. |
| `email` string Required The email of the author or committer of the commit. You'll receive a `422` status code if `email` is omitted. |
| `date` string |



### [HTTP response status codes for "Create or update file contents"](#create-or-update-file-contents--status-codes)


| Status code | Description |
| `200` | OK |
| `201` | Created |
| `404` | Resource not found |
| `409` | Conflict |
| `422` | Validation failed, or the endpoint has been spammed. |



### [Code samples for "Create or update file contents"](#create-or-update-file-contents--code-samples)

#### Request examples

 Select the example type Example for creating a file Example for updating a file

 put /repos /{owner} /{repo} /contents /{path}


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -X PUT \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/contents/PATH \
 -d '{"message":"my commit message","committer":{"name":"Monalisa Octocat","email":"octocat@github.com"},"content":"bXkgbmV3IGZpbGUgY29udGVudHM="}'`

#### Response


- Example response
- Response schema

 `Status: 201`

 `{
 "content": {
 "name": "hello.txt",
 "path": "notes/hello.txt",
 "sha": "95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
 "size": 9,
 "url": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
 "html_url": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt",
 "git_url": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
 "download_url": "https://raw.githubusercontent.com/octocat/HelloWorld/master/notes/hello.txt",
 "type": "file",
 "_links": {
 "self": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
 "git": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
 "html": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt"
 }
 },
 "commit": {
 "sha": "7638417db6d59f3c431d3e1f261cc637155684cd",
 "node_id": "MDY6Q29tbWl0NzYzODQxN2RiNmQ1OWYzYzQzMWQzZTFmMjYxY2M2MzcxNTU2ODRjZA==",
 "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd",
 "html_url": "https://github.com/octocat/Hello-World/git/commit/7638417db6d59f3c431d3e1f261cc637155684cd",
 "author": {
 "date": "2014-11-07T22:01:45Z",
 "name": "Monalisa Octocat",
 "email": "octocat@github.com"
 },
 "committer": {
 "date": "2014-11-07T22:01:45Z",
 "name": "Monalisa Octocat",
 "email": "octocat@github.com"
 },
 "message": "my commit message",
 "tree": {
 "url": "https://api.github.com/repos/octocat/Hello-World/git/trees/691272480426f78a0138979dd3ce63b77f706feb",
 "sha": "691272480426f78a0138979dd3ce63b77f706feb"
 },
 "parents": [
 {
 "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/1acc419d4d6a9ce985db7be48c6349a0475975b5",
 "html_url": "https://github.com/octocat/Hello-World/git/commit/1acc419d4d6a9ce985db7be48c6349a0475975b5",
 "sha": "1acc419d4d6a9ce985db7be48c6349a0475975b5"
 }
 ],
 "verification": {
 "verified": false,
 "reason": "unsigned",
 "signature": null,
 "payload": null,
 "verified_at": null
 }
 }
}`



## [Delete a file](#delete-a-file)

 Deletes a file in a repository.

 You can provide an additional `committer` parameter, which is an object containing information about the committer. Or, you can provide an `author` parameter, which is an object containing information about the author.

 The `author` section is optional and is filled in with the `committer` information if omitted. If the `committer` information is omitted, the authenticated user's information is used.

 You must provide values for both `name` and `email`, whether you choose to use `author` or `committer`. Otherwise, you'll receive a `422` status code.

 Note


If you use this endpoint and the "[Create or update file contents](https://docs.github.com/rest/repos/contents/#create-or-update-file-contents)" endpoint in parallel, the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead.

### [Fine-grained access tokens for "Delete a file"](#delete-a-file--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have at least one of the following permission sets:


- "Contents" repository permissions (write)
- "Contents" repository permissions (write) and "Workflows" repository permissions (write)

### [Parameters for "Delete a file"](#delete-a-file--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |
| `path` string Required path parameter |

 Body parameters
| Name, Type, Description |
| `message` string Required The commit message. |
| `sha` string Required The blob SHA of the file being deleted. |
| `branch` string The branch name. Default: the repository’s default branch |
| `committer` object object containing information about the committer. |
| Properties of `committer` Name, Type, Description |
| `name` string The name of the author (or committer) of the commit |
| `email` string The email of the author (or committer) of the commit |


| `author` object object containing information about the author. |
| Properties of `author` Name, Type, Description |
| `name` string The name of the author (or committer) of the commit |
| `email` string The email of the author (or committer) of the commit |



### [HTTP response status codes for "Delete a file"](#delete-a-file--status-codes)


| Status code | Description |
| `200` | OK |
| `404` | Resource not found |
| `409` | Conflict |
| `422` | Validation failed, or the endpoint has been spammed. |
| `503` | Service unavailable |



### [Code samples for "Delete a file"](#delete-a-file--code-samples)

#### Request example

 delete /repos /{owner} /{repo} /contents /{path}


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -X DELETE \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/contents/PATH \
 -d '{"message":"my commit message","committer":{"name":"Monalisa Octocat","email":"octocat@github.com"},"sha":"329688480d39049927147c162b9d2deaf885005f"}'`

#### Response


- Example response
- Response schema

 `Status: 200`

 `{
 "content": null,
 "commit": {
 "sha": "7638417db6d59f3c431d3e1f261cc637155684cd",
 "node_id": "MDY6Q29tbWl0NzYzODQxN2RiNmQ1OWYzYzQzMWQzZTFmMjYxY2M2MzcxNTU2ODRjZA==",
 "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd",
 "html_url": "https://github.com/octocat/Hello-World/git/commit/7638417db6d59f3c431d3e1f261cc637155684cd",
 "author": {
 "date": "2014-11-07T22:01:45Z",
 "name": "Monalisa Octocat",
 "email": "octocat@github.com"
 },
 "committer": {
 "date": "2014-11-07T22:01:45Z",
 "name": "Monalisa Octocat",
 "email": "octocat@github.com"
 },
 "message": "my commit message",
 "tree": {
 "url": "https://api.github.com/repos/octocat/Hello-World/git/trees/691272480426f78a0138979dd3ce63b77f706feb",
 "sha": "691272480426f78a0138979dd3ce63b77f706feb"
 },
 "parents": [
 {
 "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/1acc419d4d6a9ce985db7be48c6349a0475975b5",
 "html_url": "https://github.com/octocat/Hello-World/git/commit/1acc419d4d6a9ce985db7be48c6349a0475975b5",
 "sha": "1acc419d4d6a9ce985db7be48c6349a0475975b5"
 }
 ],
 "verification": {
 "verified": false,
 "reason": "unsigned",
 "signature": null,
 "payload": null,
 "verified_at": null
 }
 }
}`



## [Get a repository README](#get-a-repository-readme)

 Gets the preferred README for a repository.

 This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."



- **`application/vnd.github.raw+json`**: Returns the raw file contents. This is the default if you do not specify a media type.

- **`application/vnd.github.html+json`**: Returns the README in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).

### [Fine-grained access tokens for "Get a repository README"](#get-a-repository-readme--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have the following permission set:


- "Contents" repository permissions (read)

 This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Get a repository README"](#get-a-repository-readme--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |

 Query parameters
| Name, Type, Description |
| `ref` string The name of the commit/branch/tag. Default: the repository’s default branch. |

### [HTTP response status codes for "Get a repository README"](#get-a-repository-readme--status-codes)


| Status code | Description |
| `200` | OK |
| `304` | Not modified |
| `404` | Resource not found |
| `422` | Validation failed, or the endpoint has been spammed. |



### [Code samples for "Get a repository README"](#get-a-repository-readme--code-samples)

#### Request example

 get /repos /{owner} /{repo} /readme


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/readme`

#### Response


- Example response
- Response schema

 `Status: 200`

 `{
 "type": "file",
 "encoding": "base64",
 "size": 5362,
 "name": "README.md",
 "path": "README.md",
 "content": "encoded content ...",
 "sha": "3d21ec53a331a6f037a91c368710b99387d012c1",
 "url": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
 "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
 "html_url": "https://github.com/octokit/octokit.rb/blob/master/README.md",
 "download_url": "https://raw.githubusercontent.com/octokit/octokit.rb/master/README.md",
 "_links": {
 "git": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
 "self": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
 "html": "https://github.com/octokit/octokit.rb/blob/master/README.md"
 }
}`



## [Get a repository README for a directory](#get-a-repository-readme-for-a-directory)

 Gets the README from a repository directory.

 This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."



- **`application/vnd.github.raw+json`**: Returns the raw file contents. This is the default if you do not specify a media type.

- **`application/vnd.github.html+json`**: Returns the README in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).

### [Fine-grained access tokens for "Get a repository README for a directory"](#get-a-repository-readme-for-a-directory--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have the following permission set:


- "Contents" repository permissions (read)

 This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Get a repository README for a directory"](#get-a-repository-readme-for-a-directory--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |
| `dir` string Required The alternate path to look for a README file |

 Query parameters
| Name, Type, Description |
| `ref` string The name of the commit/branch/tag. Default: the repository’s default branch. |

### [HTTP response status codes for "Get a repository README for a directory"](#get-a-repository-readme-for-a-directory--status-codes)


| Status code | Description |
| `200` | OK |
| `404` | Resource not found |
| `422` | Validation failed, or the endpoint has been spammed. |



### [Code samples for "Get a repository README for a directory"](#get-a-repository-readme-for-a-directory--code-samples)

#### Request example

 get /repos /{owner} /{repo} /readme /{dir}


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/readme/DIR`

#### Response


- Example response
- Response schema

 `Status: 200`

 `{
 "type": "file",
 "encoding": "base64",
 "size": 5362,
 "name": "README.md",
 "path": "README.md",
 "content": "encoded content ...",
 "sha": "3d21ec53a331a6f037a91c368710b99387d012c1",
 "url": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
 "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
 "html_url": "https://github.com/octokit/octokit.rb/blob/master/README.md",
 "download_url": "https://raw.githubusercontent.com/octokit/octokit.rb/master/README.md",
 "_links": {
 "git": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
 "self": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
 "html": "https://github.com/octokit/octokit.rb/blob/master/README.md"
 }
}`



## [Download a repository archive (tar)](#download-a-repository-archive-tar)

 Gets a redirect URL to download a tar archive for a repository. If you omit `:ref`, the repository’s default branch (usually
`main`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use
the `Location` header to make a second `GET` request.

 Note


For private repositories, these links are temporary and expire after five minutes.

### [Fine-grained access tokens for "Download a repository archive (tar)"](#download-a-repository-archive-tar--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have the following permission set:


- "Contents" repository permissions (read)

 This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Download a repository archive (tar)"](#download-a-repository-archive-tar--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |
| `ref` string Required |

### [HTTP response status codes for "Download a repository archive (tar)"](#download-a-repository-archive-tar--status-codes)


| Status code | Description |
| `302` | Found |



### [Code samples for "Download a repository archive (tar)"](#download-a-repository-archive-tar--code-samples)

#### Request example

 get /repos /{owner} /{repo} /tarball /{ref}


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/tarball/REF`

#### Response

 `Status: 302`



## [Download a repository archive (zip)](#download-a-repository-archive-zip)

 Gets a redirect URL to download a zip archive for a repository. If you omit `:ref`, the repository’s default branch (usually
`main`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use
the `Location` header to make a second `GET` request.

 Note


For private repositories, these links are temporary and expire after five minutes. If the repository is empty, you will receive a 404 when you follow the redirect.

### [Fine-grained access tokens for "Download a repository archive (zip)"](#download-a-repository-archive-zip--fine-grained-access-tokens)

 This endpoint works with the following fine-grained token types :


- [GitHub App user access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

 The fine-grained token must have the following permission set:


- "Contents" repository permissions (read)

 This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Download a repository archive (zip)"](#download-a-repository-archive-zip--parameters)

 Headers
| Name, Type, Description |
| `accept` string Setting to `application/vnd.github+json` is recommended. |

 Path parameters
| Name, Type, Description |
| `owner` string Required The account owner of the repository. The name is not case sensitive. |
| `repo` string Required The name of the repository without the `.git` extension. The name is not case sensitive. |
| `ref` string Required |

### [HTTP response status codes for "Download a repository archive (zip)"](#download-a-repository-archive-zip--status-codes)


| Status code | Description |
| `302` | Found |



### [Code samples for "Download a repository archive (zip)"](#download-a-repository-archive-zip--code-samples)

#### Request example

 get /repos /{owner} /{repo} /zipball /{ref}


- cURL
- JavaScript
- GitHub CLI

 Copy to clipboard curl request example

 `curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer <YOUR-TOKEN>" \
 -H "X-GitHub-Api-Version: 2026-03-10" \
 https://api.github.com/repos/OWNER/REPO/zipball/REF`

#### Response

 `Status: 302`
