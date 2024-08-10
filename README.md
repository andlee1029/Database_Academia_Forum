Title: Academia Unity

Purpose: The purpose of my application is to create a dashboard that allows faculty across the nation to become more interconnected. The objective is to allow the faculty to easily browse connections amongst themselves to hopefully boost each other's success. Using they dashboard, they are able to find faculty most similar to them, faculty most similar to a set of specified keywords, and they are able to update their information and add publications to allows others to find them.

Demo: https://mediaspace.illinois.edu/media/t/1_re42r3wy


Installation: The dataset is the same, therefore no set up is needed there. As for running the server and the client, simply clone the repository and run "npm install" in the dashborad-app and academicapp directories, and then "npm run dev" in the dashboard-app folder and "npm start" in the other. In the academicapp directory, add a .env file with the following information (with your credentials filled in): 
    MONGODB_URI=
    MYSQL_USERNAME=
    MYSQL_PASSWORD=
    NEO4J_URI=
    NEO4J_USERNAME=
    NEO4J_PASSWORD=


Usage: Use the first widget to set your profile. Clicking edit, modifying you information, then saving will update the database. The second widget shows all your publications and allows you to add more as faculty continue to pursue academia. Make sure you use correct types otherwise the addition will be rejected, and you will receive an alert telling you so. The third widget shows the ten most similar faculty across the domain. This was calculated by adding up the scores of any mutual keywords and using that as a score, the higher the better. This allows users to easily find similar colleagues. The fourth widget allows you to search faculty by name, and then shows their picture and more detailed information (some people don't have their information available so make sure you try a couple if nothing shows up). This allows users to actually be able to contact each other. The fifth widget shows a graph where if you enter an affiliation name, it allows you to compare how many publications have been published in the last 10 years. Finally the last widget allows you to search through all faculty by keyword. By continuously adding keywords, the search will be more tailored and helpful to users. 

Design and Implementation: I used a server and client architecture where the server was implemented using expressjs and the client was created using React. For the graphs I used Chartjs which is a handy javascript framework for woking with data. The server was in charge of all database operations, and would pass the information to the client through JSON objects. This encapsulated the handling of the three different databases in the backend, so the client didn't have to manage three connections. 

Database tecniques: I used mongodb for most of the widgets which dealt with faculty members, and neo4j for the graphs, and then mysql for dealing with publications. I added constraints to my mysql database to ensure that publication additions were valid, and also used transactions when adding a new publication. Since I had to insert into many tables that referenced each other, if one operation failed the transaction allowed me to rollback all changes. I also used a rest api endpoint to serve data as mentioned before. Inserts were handled by post requests and retrieval through get requests. The backend worked by taking the inputs parsed from the url parameters and using them as inputs into the prepared database queries.
