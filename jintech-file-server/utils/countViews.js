export const counts = [];

addCount =  () =>{

}


const setIntervalQuery = () => {
    setInterval(() => {
        console.log('interval');
    }, 6000);
}

const countViews = {
    addCount,
    //   isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = countViews;
