# Playstation Matchwer
Deze applicatie is gericht op het bijhouden welke Playstation games je hetb gespeeld. Hierbij kan 
je met anderen vergelijken wie de leukste of de meeste games heeft gespeeld. 

## My feature
Ik heb een registreer functie gemaakt. Deze functie bestaat uit het registreren van een Useraccount. Hierbij kan je kiezen uit een overzicht welke games je hebt gespeeld. 
Die game word opgeslagen in de database. 

## How to install

### Serverside
1. Copy the clone repository link
```
https://github.com/Fayaaz036/bt_2023.git
```
2. In your desired directory, type this:
```console
git clone https://github.com/Fayaaz036/bt_2023.git
```
3. Install packages
```console
npm install
```
4. Run server
```console
nodemon server.js
```
### Database side
Door een locale .env file bevattend de login credentials van de database, zet ik de connectie tot stand. Omdat die file user-gebonden is, en uniek aan mijn eigen account word die niet verzonden met de push/pull van github. Daarom word er verzocht een eigen .env bestand aan te maken bevattend met de gebruikers specifieke inloggegevens. 

In de database staan de Useraccounts. Deze staan opgeslagen in de database 'playstationapp'. Binnen deze database staat een collectie genaamt 'Users'. 
In deze collectie staan alle gebruikers. Hierin worden de gebruikersnaam, wachtwoord en gespeelde games bijgehouden. 


```console
_id: ObjectId('6410928cb0222bdb2c8c687c')
name: "FayaazN"
pass: "mijnwachtwoord"
game: Array 0 :  "GTA V" 1 :  "Modern Warfare" 2 :  "Gran Turismo 7" 
3 :  "Fortnite" 4 :  "FIFA 23"

```
### PSN API
De API die ik wou gebruiken voor deze applicatie werkte helaas niet naar behoren, en kreeg ik niet werkend op de applicatie. Het plan was dat de API via een Auth.Token de gebruiker zijn Playstation Network profiel inlaadde. De fallback die ik heb 
gebruikt voor dit idee is de games in een array te zetten in de database.
```console
game: Array 0 :  "GTA V" 1 :  "Modern Warfare" 2 :  "Gran Turismo 7"
3 :  "Fortnite" 4 :  "FIFA 23"
```