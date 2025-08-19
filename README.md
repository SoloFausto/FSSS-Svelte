# Fausto's Modified Super Secret Settings

![FSSS Logo](https://github.com/SoloFausto/FSSS-Svelte/blob/main/src/lib/img/favicon-192x192.png)
FSSS is a hashing password manager inspired by PagoruDev's version which features a node based interface to manage passwords. The program uses the value of each node and it's parents, along with a master password, as an input to a semi random generator to create a unique password. This generated password is customizable further with the properties that are present in each node.

> [!CAUTION]
> I make no guarantees over the security of the generated passwords or generally anything about the program, this is a personal passion project and it should be treated as one.
>  Have always a secure method to restore your passwords, as updates that change how the passwords are generated might be introduced.

The program supports exporting these nodes as an encrypted schema file that hides the names of each node, but never exports the passwords as they are always calculated on the fly. You can also store an encrypted version in the browser storage to always have easy access in your passwords at any time.

Currently the software supports being ran as a native Android app, a progressive web app, or simply by the browser.
