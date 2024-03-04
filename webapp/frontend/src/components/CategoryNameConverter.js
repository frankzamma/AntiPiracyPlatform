function getCategoryName (categoryNum){
        let categoryString;

        switch (categoryNum) {
            case 0 :
                categoryString = "Basket"
                break;
            case 1:
                categoryString = "Boxing"
                break;
            case 2:
                categoryString = "Scherma"
                break;
            case 3:
                categoryString = "Calcio"
                break;
            case 4:
                categoryString = "Formula 1"
                break;
            case 5:
                categoryString = "MotoGp"
                break;
            case 6:
                categoryString = "Nuoto"
                break;
            case 7:
                categoryString = "Tennis"
                break;
            case 8:
                categoryString = "Pallavolo"
                break;
            default:
                categoryString = "ERROR!"
        }

        return categoryString;
}

export default getCategoryName