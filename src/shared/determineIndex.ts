export default function determineIndex(index:number, numberOfLoops:number){
    const currentIndex = index % numberOfLoops - 1;

    if(currentIndex < 0){
        return  Math.floor(index / numberOfLoops) + currentIndex;
    }
}