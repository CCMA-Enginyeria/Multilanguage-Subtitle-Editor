# Subtitles Editor Tool

This Subtitles Editor Tool is an application made for helping with the revision of automated translations in subtitles. It has been developed in the Corporació Catalana de Mitjans Audiovisuals during the participation in the project [EasyTV](https://easytvproject.eu/), consisting in easing the access for people with disabilities to media and content.

## 📚 General Description

The tool let users to see all the subtitles with its translation and edit or translate them. This, is synced to the player. The interface is the following:

![enter image description here](https://github.com/CCMA-Enginyeria/Multilanguage-Subtitle-Editor/blob/master/snapshots/interface.png?raw=true)

So,  the application receives as input to XML files containing the original subtitles and a translated version, and the link of the corresponding video.

The interface is just what is seen in the image above: the subtitles at left, and the player and some stats at right. Each subtitle box also contains the associated timecodes (input and output), the original subtitle, the translation, and some tools for the edition.
  
In our case, the tool is embed in a dashboard that allows the users to assign themselves different translation tasks.

## 💡Main features

### For each subtitle box:

-   **Check box**: To indicate if translation is correct.
-   **Edit text field**: Appears when a subtitle is clicked and enables the edition.
-   **Undo Button**: Made to undo changes if the subtitle has been modified.
-   **Text overflow icon**: Warns the user about the excessive length of a text in relation to the time this is going to be displayed.
-   **Add/Remove line buttons**: When the user clicks a subtitle box to edit it, a plus or minus button appears, depending on the subtitle is a single line one, or double line.

### Others  
- **Edit title and synopsis:** It is also possible to show a modal that allows to edit the title and synopsis of the asset.
- **Filter subtitles:** Filters are implemented to make the edition efficient by focusing only in the desired subtitles: accepted, edited, too long ones etc.
- **Player:** Shows the video with the subtitles rendered in it in real time. Its timecode is synchronized with the subtitles boxes.
- **Timeline:** A simplified version of the subtitles displayed below the player that helps focusing in the player without looking in the main list.
- **Stats:** Shows the numbers and progress bars of the accepted, viewed, and edited subtitles.
- **Help:** A short legend with the main shortcuts and color codes.


## 🛠️ Implementation

This tool is designed as a Single Page Application (SPA). The used architecture is an MVC (Model-view-controller) implemented with [Backbone](https://backbonejs.org/).  Also, we are using [Underscore](https://underscorejs.org/) for the helpers and [Handlebars](https://handlebarsjs.com/) for creating the HTML templates.  

**Data storing:** In order to store the subtitle data in the server, we use the same XML input, where we make changes by adding new tags to the XML entries. All the important data stored in the models is added as tags. For example, if a subtitle is edited, we will add `edited=true` in the corresponding xml child.

So, to save it to our servers we just make a request with a JSON that contains the modified XML.  

**Player:** To render the subtitles on the video we are using the EbuTTD format and our own Subtitle Plugin use in the whole Corporació Catalana de Mitjans Audiovisuals.
So, the player consists of two layers. One with the video itself rendered with the VideoJS plugin, and the other with the Subtitles Plugin where the subtitles are rendered.


## Author
© Corporació Catalana de Mitjans Audiovisuals, SA.

contact: Enginyeria-Recerca@ccma.cat

## ⚠️  Licence
The code in this project is licensed under [Creative Commons 2.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).

![enter image description here](https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.eu.png)

