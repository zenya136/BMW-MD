const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkdPc2JQVG5sM0NMSzg3cXVIUkthUm1SK2pFL2JMUDdSOGZoRzh5OXJFaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUVkUkNxNC9neVdpSG5WVzdSc29sOWZkR3hxekZraVJyQUk1S3V1UkNIVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXTEFGTU0wUDlScGZFZTRER2ZwRngzNzAvV3RYcHVYTE8xbjZzNDN0QTNjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJuaHdYYzR4dXZpMFJQOXV3WUFmenY3QVQ2Sm5sanlNS3VPZXdoUnI5dUVRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBejQ2aVNkcVp4TS9oZzNkWW00QkJMeVVsenR2R0ZRN3Q3clVzdFJPMjg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjErOUQwaXZKLzBRUFJma1hvT3lsSVZTbmNvbkFtY2lPUEFpdGphNVBJbVE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUZBZFRsSm4yc0hxOGxENDQwQ05LNGU3Znd1N3d0UDkvYjZGdVVIb3ptOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSFNaU09zbmE4dDF4NjU1a014MG1oYm1lbzJnT1lKaFA2RHN6bXVYaDVSdz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Imtid0NBVFFleHVSK1VZbWRJQkxBMVFPdWVUdW94VkVQSjZYOGJvbWt2a252blVqNFp5MVZrY2E5eGg2NjQ0Vzgxa0cxdXBSQUZ1aTMvU0JQMEZFVUF3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI1LCJhZHZTZWNyZXRLZXkiOiJTSzVVeXpVSzdZaW5wdW9VUWt6MWVsYmtGTTdMZE1KTnYxL2JFWWlrcStjPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJpNW1ibGR5NlNqcUpLbkl4NnhPRVNRIiwicGhvbmVJZCI6IjcxMWE2NTEwLWY1NWQtNDgwOS04MDQxLTJhNjQwNTBhZmNiZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVclVTdkhrUVhOT044ZXZnZUFOUEJCdVhNVGM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNUtRWmZIT2JQb201T2Fjc25NT2hXMWtQV2ZvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkI1RkI5VzlEIiwibWUiOnsiaWQiOiIyNjA5NzE4MTY5NTY6NjdAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiTWFrbyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSzZwbHNrRUVJN2ptclFHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOXd0Z0F5aEV2N2xFZEFBSmwxQU5kTzZLNDN5U08zelAzRGdKY0tTT2ltdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoibUgvS1NGckxObXFuWXFZUG9ScWZ0WTVqSTNqb3BFekEwOGxIVERxRFFRNzRWaEp5VTN1QVJDLzhoWHMyUzhZajJ3MEFyTXRZbmVvUmE4bkNIQlFSQWc9PSIsImRldmljZVNpZ25hdHVyZSI6InJldW9ZZXduSnM0ZFYxVSt2N3ZIbHpjOHNFU096YlZibFozN1AwU05tN2FIQ1kxdTg0ay96Zjk4a0MxU1BlMHV1YWRMdUhmSWR6bEY5UjBadVoyOEFnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjYwOTcxODE2OTU2OjY3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZjTFlBTW9STCs1UkhRQUNaZFFEWFR1aXVOOGtqdDh6OXc0Q1hDa2pvcHMifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjAxMDMzMjN9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "KING👑MAKO",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "KING👑MAKO",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'MAKO',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/fd124f7e9271111c3bcc1.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
