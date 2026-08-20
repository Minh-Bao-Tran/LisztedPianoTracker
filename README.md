# Start the app:
git pull [link]

npm i

npm run dev

# Purpose: An offline, distraction-free music tracker solution that allows the user to

1. Store Pieces and related data in a centralisingly
2. Start practice sessions
3. Provides analytics of the user's practice sessions
4. Search music terms

# Purpose Breakdown
Electron Framework is used to develop the offline, local app.

The Backend is developed using Nodejs(Typescript). Its purpose is to handle complex logic with relationships between different objects(entities), and store and fetch data on demand.

The Frontend is developed using HTML, CSS, Javascript (React framework, React-Router-v7 Package). Its purpose is to provide an easy-to-use UI for the user.

# Naming Convention
Camel Case(ex: myVar) is utilised for local constants(ex: filteredGoal), variables(ex: currentLatestGoal), functions(ex:  readAllCSV()), and class attributes(ex: schema) and methods(ex: findLastPractice()).

Pascal Case (or Upper Camel Case, ex: MyVar) is utilised for type declarations(ex: TableModel), classes (ex: Piece), and interface (PieceData).

All Capitallised Snake Case is utilised for Global Variable/Constant (Ex: PIECE_TYPES)

# Data Sources:
see:
Term.model.ts

# Data Structures
Local Variables


Global Variables/Constants


Constants


Arrays:
see: Piece.model.ts. Properties marked as Foreign Key
table.ts. Public findMany()


Records(Objects):
see: any files with .model.ts


Set


# Controls
Sequence

Selection

Iteration

# OOP Principles
Generalisation
Abstraction
Inheritance
Encapsulation