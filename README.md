## ABOUT ME

name : ```sakibin Developer```</br>
age : ```18```</br>
link : [facebook](https://www.facebook.com/imsakibin007).</br>
## START UP

```txt
npm install
```
```txt
node sakibin/catalogs/sakibina.js
```

## CREDITS

original file : [BotPack](https://replit.com/@YanMaglinte/BotPack?v=1) by ```YanMaglinte```</br>
modified : [sakibin](https://replit.com/@sakibindev/sakibin?v=1) by ```sakibin Developer```</br>
fca : [ws3-fca](https://www.npmjs.com/package/ws3-fca) by ```Kenneth Aceberos```

## UPDATES

• added email function, this updates belongs to premium system and box approval system. if the user is requesting for approval the notification will sent from your email address. enter your email address at ``sakibin.json``.</br>
• configure console output in ``sakibin/configs/console.js``.</br>
• fixed spam in ban system.</br>
• discover the new feature with ```premium command```, you can enable it by adding a variable named ```premium``` and the value is boolean</br></br>
```premium ussage example```
```js
module.exports.config = {
  name: "name",
  aliases: ["name2", "name3"], //new aliases for new name
  version: "example",
  credits: "example",
  permission: 0,
  description: "example",
  category: "example",
  usages: "example",
  prefix: true,
  premium: true, // this is the example of premium feature ussage
  cooldown: 0,
  dependencies: {
    "": ""
  }
}
```
```txt
UPDATE :
adding aliases for each commands
```

## CONFIG AND CUSTOM

sakibin.js : ``configure auto restart and auto accept pending messages.``</br>
sakibin.json : ``configure bot name, bot prefix, bot operators and admins.``</br>
sakibinstate.json : ``account cache data.``

## BOX APPROVAL

``box approval`` is set as default, you can disable it on ``sakibin.json`` by setting the ``approval`` value into ``false``</br>

you can approve box by using ``approve`` command without using prefix, how to use? just type ``approve (box/remove) (uid/tid)``</br>

EXAMPLES : </br>

view approved list 
```txt 
approve list
```
add box from approved list 
```txt
approve box 4834812366643016
```
remove box from approved list 
```txt
approve remove 4834812366643016
```

## HOW TO GET 'sakibinSTATE.JSON' DATA?

to get ``sakibinstate.json`` data, please follow these steps :</br>

step 1 : download fbstate exporter [here](https://www.mediafire.com/file/vyy6jbo7ul2d3th/fbstate_exporter-1.0.xpi+(1).zip/file)</br>

step 2 : download ``kiwi browser`` from the play store.</br>

step 3 : open kiwi browser and tap on the three dots at the top right corner.</br>

step 4 : select ``extensions`` from the menu.</br>

step 5 : tap on ``+ from (.zip/ .crx/ .user.js)`` and choose the file "fbstate_exporter-1.0.xpi (1).zip" that you downloaded.</br>

step 6 : once the extension is added, go to ``www.facebook.com`` and log in to the account you want to use as a bot.</br>

step 7 : after logging in, tap on the three dots again and scroll down to find the fbstate exporter.</br>

step 8 : click on it and then click on ``copy fbstate``.</br>

step 9 : paste the copied data into the ``sakibinstate.json`` file.</br>

step 10 : finally, click on ``run`` to initiate the bot.</br>


## HOW TO ADD COMMANDS?
```js
module.exports.config = {
  name: "example", // command name.
  aliases: ["name2", "name3"], //new aliases for new name
  version: "1.0.0", // command version.
  permission: 0, // set to 1 if you want to set the permission into a group admins, set to 2 if you want to set the permission into a bot admins, set to 3 if you want to set the permission into a bot operators.
  credits: "sakibin",
  description: "example", // command description.
  prefix: false, // set to true if you want to use the command with prefix, set to false if you want to use the commands without prefix.
  category: "example", // command category.
  usages: "example", // command ussage.
  cooldowns: 5, // 5 seconds command cooldown.
  dependencies: {
		"name": "version" // not required but if the command have a npm packages, you can type the package name and version to automatically install the package.
	}
};

module.exports.run = async ({api, event, args}) => {
  // start coding
}
```
