# Important notes:
Time in Practice session is sped up to not waste your marking time(by 10 times). However, the logic still works correctly if it is slowed down.


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


# Data Sources
The main data sources are the CSV file and the data entered by the user. 
However, a part of a public data set is also used(see term.model.ts)

Examples:

- `csv-util.ts` — `readAllCSV`
- `csv-util.ts` — `writeCSV`
- `table.ts` — `fetch`
- `table.ts` — `storeData`
- `preload.cts` — `getAllPiece`

# Data Structures
Records:

- `Piece.model.ts` — `validateAndCreate`
- `Piece.model.ts` — `findLastPractice`
- `Goal.model.ts` — `schema`
- `Subsession.model.ts` — `validateAndCreate`
- `table.ts` — `TableModel` (type)

Set: `table.ts` - `generateNewId`

Array: 
- `AllPieces.tsx` - `line 107 and line 129 - using arrays as they provide quick methods to iterate on the same type of data`
- `table.ts` - Foreign Key
- `Piece.model.ts` - Foreign Keys

OOP principles: please see all files with `.model.ts ` and `table.ts`

# Data types
Please see all files with `.model.ts`
Notes: Boolean is not frequently used as it is replaced by enums in most case, as Enums allows more specific, but still discrete, information to be displayed

Boolean is reserved for The status of update/Add/Delete success status (see `types.d.ts` - `EventMapping`)