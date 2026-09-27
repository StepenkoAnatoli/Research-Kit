---
url: https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables
retrieved: 2026-09-27
command: firecrawl scrape https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Recognized environment variables | Microsoft Learn
---
Table of contents Exit editor mode

Ask LearnAsk Learn

Reading modeTable of contents[Read in English](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables)Add to CollectionsAdd to Plans[Edit](https://github.com/MicrosoftDocs/windows-itpro-docs/blob/public/windows/deployment/usmt/usmt-recognized-environment-variables.md)

* * *

Copy MarkdownPrint

* * *

Note

Access to this page requires authorization. You can try [signing in](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables#) or changing directories.


Access to this page requires authorization. You can try changing directories.


# Recognized environment variables

- Applies to: ✅ [Windows 11](https://learn.microsoft.com/windows/release-health/supported-versions-windows-client), ✅ [Windows 10](https://learn.microsoft.com/windows/release-health/supported-versions-windows-client)

Feedback

Summarize this article for me


When the XML files `MigDocs.xml`, `MigApp.xml`, and `MigUser.xml` are used, the environment variables can be used to identify folders that can be different on different computers. Constant special item ID list (CSIDL) values provide a way to identify folders that applications use frequently but could have different names or locations on any given computer. For example, the **Documents** folder could be `C:\Users\<Username>\Documents` on one computer and `C:\Users\<Username>\My Documents` on another. The asterisk (\*) wildcard character can be used in the `MigUser.xml`, `MigApp.xml` and `MigDoc.xml` files. However, the asterisk (\*) wildcard character can't be used in the `Config.xml` file.

[Section titled: Variables that are processed for the operating system and in the context of each user](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables#variables-that-are-processed-for-the-operating-system-and-in-the-context-of-each-user)

## Variables that are processed for the operating system and in the context of each user

These variables can be used within sections in the **.xml** files with `context=UserAndSystem`, `context=User`, and `context=System`.

Expand table

| Variable | Explanation |
| --- | --- |
| _ALLUSERSAPPDATA_ | Same as **CSIDL\_COMMON\_APPDATA**. |
| _ALLUSERSPROFILE_ | Refers to `%PROFILESFOLDER%\Public` or `%PROFILESFOLDER%\all users`. |
| _COMMONPROGRAMFILES_ | Same as **CSIDL\_PROGRAM\_FILES\_COMMON**. |
| _COMMONPROGRAMFILES_(X86) | Refers to the `C:\Program Files (x86)\Common Files` folder on 64-bit systems. |
| _CSIDL\_COMMON\_ADMINTOOLS_ | Version 10.0. The file-system directory that contains administrative tools for all users of the computer. |
| _CSIDL\_COMMON\_ALTSTARTUP_ | The file-system directory that corresponds to the non-localized Startup program group for all users. |
| _CSIDL\_COMMON\_APPDATA_ | The file-system directory that contains application data for all users. A typical path Windows is `C:\ProgramData`. |
| _CSIDL\_COMMON\_DESKTOPDIRECTORY_ | The file-system directory that contains files and folders that appear on the desktop for all users. A typical path is `C:\Users\Public\Desktop`. |
| _CSIDL\_COMMON\_DOCUMENTS_ | The file-system directory that contains documents that are common to all users. A typical path is `C:\Users\Public\Documents`. |
| _CSIDL\_COMMON\_FAVORITES_ | The file-system directory that serves as a common repository for favorites common to all users. A typical path is C:\\Users\\Public\\Favorites. |
| _CSIDL\_COMMON\_MUSIC_ | The file-system directory that serves as a repository for music files common to all users. A typical path is `C:\Users\Public\Music`. |
| _CSIDL\_COMMON\_PICTURES_ | The file-system directory that serves as a repository for image files common to all users. A typical path is `C:\Users\Public\Pictures`. |
| _CSIDL\_COMMON\_PROGRAMS_ | The file-system directory that contains the directories for the common program groups that appear on the **Start** menu for all users. A typical path is `C:\ProgramData\Microsoft\Windows\Start Menu\Programs`. |
| _CSIDL\_COMMON\_STARTMENU_ | The file-system directory that contains the programs and folders that appear on the **Start** menu for all users. A typical path in Windows is `C:\ProgramData\Microsoft\Windows\Start Menu`. |
| _CSIDL\_COMMON\_STARTUP_ | The file-system directory that contains the programs that appear in the Startup folder for all users. A typical path is `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup`. |
| _CSIDL\_COMMON\_TEMPLATES_ | The file-system directory that contains the templates that are available to all users. A typical path is `C:\ProgramData\Microsoft\Windows\Templates`. |
| _CSIDL\_COMMON\_VIDEO_ | The file-system directory that serves as a repository for video files common to all users. A typical path is `C:\Users\Public\Videos`. |
| _CSIDL\_DEFAULT\_APPDATA_ | Refers to the `Appdata` folder inside `%DEFAULTUSERPROFILE%`. |
| C _SIDL\_DEFAULT\_LOCAL\_APPDATA_ | Refers to the local `Appdata` folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_COOKIES_ | Refers to the Cookies folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_CONTACTS_ | Refers to the Contacts folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_DESKTOP_ | Refers to the Desktop folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_DOWNLOADS_ | Refers to the Downloads folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_FAVORITES_ | Refers to the Favorites folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_HISTORY_ | Refers to the History folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_INTERNET\_CACHE_ | Refers to the Internet Cache folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_PERSONAL_ | Refers to the Personal folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_MYDOCUMENTS_ | Refers to the Documents folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_MYPICTURES_ | Refers to the Pictures folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_MYMUSIC_ | Refers to the Music folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_MYVIDEO_ | Refers to the Videos folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_RECENT_ | Refers to the Recent folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_SENDTO_ | Refers to the Send To folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_STARTMENU_ | Refers to the Start Menu folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_PROGRAMS_ | Refers to the Programs folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_STARTUP_ | Refers to the Startup folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_TEMPLATES_ | Refers to the Templates folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_DEFAULT\_QUICKLAUNCH_ | Refers to the Quick Launch folder inside `%DEFAULTUSERPROFILE%`. |
| _CSIDL\_FONTS_ | A virtual folder containing fonts. A typical path is `C:\Windows\Fonts`. |
| _CSIDL\_PROGRAM\_FILESX86_ | The Program Files folder on 64-bit systems. A typical path is `C:\Program Files (x86)`. |
| _CSIDL\_PROGRAM\_FILES\_COMMONX86_ | A folder for components that are shared across applications on 64-bit systems. A typical path is `C:\Program Files (x86)\Common`. |
| _CSIDL\_PROGRAM\_FILES_ | The Program Files folder. A typical path is `C:\Program Files`. |
| _CSIDL\_PROGRAM\_FILES\_COMMON_ | A folder for components that are shared across applications. A typical path is `C:\Program Files\Common`. |
| _CSIDL\_RESOURCES_ | The file-system directory that contains resource data. A typical path is `C:\Windows\Resources`. |
| _CSIDL\_SYSTEM_ | The Windows System folder. A typical path is `C:\Windows\System32`. |
| _CSIDL\_WINDOWS_ | The Windows directory or system root path. This value corresponds to the `%WINDIR%` or `%SYSTEMROOT%` environment variables. A typical path is `C:\Windows`. |
| _DEFAULTUSERPROFILE_ | Refers to the value in `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList [DefaultUserProfile]`. |
| _PROFILESFOLDER_ | Refers to the value in `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList [ProfilesDirectory]`. |
| _PROGRAMFILES_ | Same as **CSIDL\_PROGRAM\_FILES**. |
| _PROGRAMFILES(X86)_ | Refers to the `C:\Program Files (x86)` folder on 64-bit systems. |
| _SYSTEM_ | Refers to `%WINDIR%\system32`. |
| _SYSTEM16_ | Refers to `%WINDIR%\system`. |
| _SYSTEM32_ | Refers to `%WINDIR%\system32`. |
| _SYSTEMDRIVE_ | The drive that holds the Windows folder. This value is a drive name and not a folder name (`C:` not `C:\`). |
| _SYSTEMPROFILE_ | Refers to the value in `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList\S-1-5-18 [ProfileImagePath]`. |
| _SYSTEMROOT_ | Same as **WINDIR**. |
| _WINDIR_ | Refers to the Windows folder located on the system drive. |

[Section titled: Variables that are recognized only in the user context](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables#variables-that-are-recognized-only-in-the-user-context)

## Variables that are recognized only in the user context

These variables can be used in the **.xml** files within sections with `context=User` and `context=UserAndSystem`.

Expand table

| Variable | Explanation |
| --- | --- |
| _APPDATA_ | Same as **CSIDL\_APPDATA**. |
| _CSIDL\_ADMINTOOLS_ | The file-system directory that is used to store administrative tools for an individual user. The Microsoft Management Console (MMC) saves customized consoles to this directory, which roams with the user profile. |
| _CSIDL\_ALTSTARTUP_ | The file-system directory that corresponds to the user's non-localized Startup program group. |
| _CSIDL\_APPDATA_ | The file-system directory that serves as a common repository for application-specific data. A typical path is `C:\Users\<username>\AppData\Roaming`. |
| _CSIDL\_BITBUCKET_ | The virtual folder that contains the objects in the user's Recycle Bin. |
| _CSIDL\_CDBURN\_AREA_ | The file-system directory acting as a staging area for files waiting to be written to CD. A typical path is `C:\Users\<username>\AppData\Local\Microsoft\Windows\MasteredBurning\Disc Burning`. |
| _CSIDL\_CONNECTIONS_ | The virtual folder representing Network Connections that contains network and dial-up connections. |
| _CSIDL\_CONTACTS_ | This value refers to the Contacts folder in **%CSIDL\_PROFILE%**. |
| _CSIDL\_CONTROLS_ | The virtual folder that contains icons for the Control Panel items. |
| _CSIDL\_COOKIES_ | The file-system directory that serves as a common repository for Internet cookies. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Cookies`. |
| _CSIDL\_DESKTOP_ | The virtual folder representing the Windows desktop. |
| _CSIDL\_DESKTOPDIRECTORY_ | The file-system directory used to physically store file objects on the desktop, which shouldn't be confused with the desktop folder itself. A typical path is `C:\Users\<username>\Desktop`. |
| _CSIDL\_DRIVES_ | The virtual folder representing **This PC** that contains everything on the local computer: storage devices, printers, and Control Panel. The folder could also contain mapped network drives. |
| _CSIDL\_FAVORITES_ | The file-system directory that serves as a common repository for the user's favorites. A typical path is `C:\Users\<username>\Favorites`. |
| _CSIDL\_HISTORY_ | The file-system directory that serves as a common repository for Internet history items. |
| _CSIDL\_INTERNET_ | A virtual folder for Internet Explorer. |
| _CSIDL\_INTERNET\_CACHE_ | The file-system directory that serves as a common repository for temporary Internet files. A typical path is `C:\Users\<username>\AppData\Local\Microsoft\Windows\Temporary Internet Files` |
| _CSIDL\_LOCAL\_APPDATA_ | The file-system directory that serves as a data repository for local, non-roaming applications. A typical path is `C:\Users\<username>\AppData\Local`. |
| _CSIDL\_MYDOCUMENTS_ | The virtual folder representing the **Documents** folder.A typical path is `C:\Users\<username>\Documents`. |
| _CSIDL\_MYMUSIC_ | The file-system directory that serves as a common repository for music files. A typical path is `C:\Users\<username>\Music`. |
| _CSIDL\_MYPICTURES_ | The file-system directory that serves as a common repository for image files. A typical path is `C:\Users\<username>\Pictures`. |
| _CSIDL\_MYVIDEO_ | The file-system directory that serves as a common repository for video files. A typical path is `C:\Users\<username>\Videos`. |
| _CSIDL\_NETHOOD_ | A file-system directory that contains the link objects that could exist in the **Network** virtual folder. It isn't the same as _CSIDL\_NETWORK_, which represents the network namespace root. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Network Shortcuts`. |
| _CSIDL\_NETWORK_ | A virtual folder representing the **Network** desktop item, the root of the network namespace hierarchy. |
| _CSIDL\_PERSONAL_ | The virtual folder representing the **<User>** desktop item. This value is equivalent to **CSIDL\_MYDOCUMENTS**. A typical path is `C:\User\<username>\Documents`. |
| _CSIDL\_PLAYLISTS_ | The virtual folder used to store play albums, typically `C:\Users\<username>\Music\Playlists`. |
| _CSIDL\_PRINTERS_ | The virtual folder that contains installed printers. |
| _CSIDL\_PRINTHOOD_ | The file-system directory that contains the link objects that can exist in the Printers virtual folder. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Printer Shortcuts`. |
| _CSIDL\_PROFILE_ | The user's profile folder. A typical path is `C:\Users\<username>`. |
| _CSIDL\_PROGRAMS_ | The file-system directory that contains the user's program groups, which are themselves file-system directories. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs`. |
| _CSIDL\_RECENT_ | The file-system directory that contains shortcuts to the user's most recently used documents. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Recent`. |
| _CSIDL\_SENDTO_ | The file-system directory that contains **Send To** menu items. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\SendTo`. |
| _CSIDL\_STARTMENU_ | The file-system directory that contains **Start** menu items. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Start Menu`. |
| _CSIDL\_STARTUP_ | The file-system directory that corresponds to the user's Startup program group. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`. |
| _CSIDL\_TEMPLATES_ | The file-system directory that serves as a common repository for document templates. A typical path is `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Templates`. |
| _HOMEPATH_ | Same as the standard environment variable. |
| _TEMP_ | The temporary folder on the computer. A typical path is `%USERPROFILE%\AppData\Local\Temp`. |
| _TMP_ | The temporary folder on the computer. A typical path is `%USERPROFILE%\AppData\Local\Temp`. |
| _USERPROFILE_ | Same as **CSIDL\_PROFILE**. |
| _USERSID_ | Represents the current user-account security identifier (SID). For example, `S-1-5-21-1714567821-1326601894-715345443-1026`. |

[Section titled: Related articles](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables#related-articles)

## Related articles

[USMT XML reference](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-xml-reference)

Reading mode disabled

* * *

## Feedback

Was this page helpful?


YesNoNo

Need help with this topic?


Want to try using Ask Learn to clarify or guide you through this topic?


Ask LearnAsk Learn

Suggest a fix?

* * *

## Additional resources

* * *

- Last updated on 01/29/2025

Ask Learn is an AI assistant that can answer questions, clarify concepts, and define terms using trusted Microsoft documentation.

Please sign in to use Ask Learn.

[Sign in](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables#)
