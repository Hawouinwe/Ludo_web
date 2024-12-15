function idrel_to_idabs(nrel, color) { // case relative à une coul -> case absolue
    switch(coul) {
        case "red" :
            return nrel + 45 % 60
        case "blue" :
            return nrel % 60
        case "yellow" :
            return nrel + 15 % 60
        case "green" :
            return nrel + 30 % 60
    }
} 


function idCaseAbs(nrel, coul) {
    let n = idrel_to_idabs(nrel, coul)
    switch (n) {
        case 0:
            return "last_case_blue" ;
        case 1:
            return "path_2" ;
        case 2:
            return "start_blue" ;
        case 3:
            return "path_4" ;
        case 4:
            return "path_6" ;
        case 5:
            return "path_8" ;
        case 6:
            return "path_10" ;
        case 7:
            return "path_16" ;
        case 8:
            return "path_17" ;
        case 9:
            return "path_18" ;
        case 10:
            return "star_blue" ;
        case 11:
            return "path_19" ;
        case 12:
            return "path_20" ;
        case 13:
            return "last_case_yellow" ;
        case 14:
            return "path_30" ;
        case 15:
            return "start_yellow" ;
        case 16:
            return "path_29" ;
        case 17:
            return "path_28" ;
        case 18:
            return "path_27" ;
        case 19:
            return "path_26" ;
        case 20:
            return "path_32" ;
        case 21:
            return "path_34" ;
        case 22:
            return "path_36" ;
        case 23:
            return "star_yellow" ;
        case 24:
            return "path_38" ;
        case 25:
            return "path_40" ;
        case 26:
            return "last_case_green" ;
        case 27:
            return "path_39" ;
        case 28:
            return "start_green" ;
        case 29:
            return "path_37" ;
        case 30:
            return "path_35" ;
        case 31:
            return "path_33" ;
        case 32:
            return "path_31" ;
        case 33:
            return "path_25" ;
        case 34:
            return "path_24" ;
        case 35:
            return "path_23" ;
        case 36:
            return "star_green" ;
        case 37:
            return "path_22" ;
        case 38:
            return "path_21" ;
        case 39:
            return "last_case_red" ;
        case 40:
            return "path_11" ;
        case 41:
            return "start_red" ;
        case 42:
            return "path_12" ;
        case 43:
            return "path_13" ;
        case 44:
            return "path_14" ;
        case 45:
            return "path_15" ;
        case 46:
            return "path_9" ;
        case 47:
            return "path_7" ;
        case 48:
            return "path_5" ;
        case 49:
            return "star_red" ;
        case 50:
            return "path_3" ;
        case 51:
            return "path_1" ;
        default:
            console.log("Mauvais indice !");
    }
}

function idFinalPath(coul, n) {
    switch (coul) {
        case "red" :
            switch (n) {
                case 0 :
                    return "final_path_red_1" ;
                case 1 :
                    return "final_path_red_2" ;
                case 2 :
                    return "final_path_red_3" ;
                case 3 :
                    return "final_path_red_4" ;
                case 4 :
                    return "final_path_red_5" ;
                default:
                    console.log("Mauvais indice final !");
            }

        case "blue" :
            switch (n) {
                case 0 :
                    return "final_path_blue_1" ;
                case 1 :
                    return "final_path_blue_2" ;
                case 2 :
                    return "final_path_blue_3" ;
                case 3 :
                    return "final_path_blue_4" ;
                case 4 :
                    return "final_path_blue_5" ;
                default:
                    console.log("Mauvais indice fianl !");
            }

        case "yellow" :
            switch (n) {
                case 0 :
                    return "final_path_yellow_1" ;
                case 1 :
                    return "final_path_yellow_2" ;
                case 2 :
                    return "final_path_yellow_3" ;
                case 3 :
                    return "final_path_yellow_4" ;
                case 4 :
                    return "final_path_yellow_5" ;
                default:
                    console.log("Mauvais indice final !");
            }

        case "green" :
            switch (n) {
                case 0 :
                    return "final_path_green_1" ;
                case 1 :
                    return "final_path_green_2" ;
                case 2 :
                    return "final_path_green_3" ;
                case 3 :
                    return "final_path_green_4" ;
                case 4 :
                    return "final_path_green_5" ;
                default:
                    console.log("Mauvais indice final !");
            }
        
        default:
            console.log("Mauvaise couleur !");
    }
}


function idHome(coul, n) {
    switch (coul) {
        case "red" :
            switch (n) {
                case 0 :
                    return "subhome_red_0" ;
                case 1 :
                    return "subhome_red_1" ;
                case 2 :
                    return "subhome_red_2" ;
                case 3 :
                    return "subhome_red_3" ;
                default:
                    console.log("Mauvais indice subhome !");
            }

        case "blue" :
            switch (n) {
                case 0 :
                    return "subhome_blue_0" ;
                case 1 :
                    return "subhome_blue_1" ;
                case 2 :
                    return "subhome_blue_2" ;
                case 3 :
                    return "subhome_blue_3" ;
                default:
                    console.log("Mauvais indice subhome !");
            }

        case "yellow" :
            switch (n) {
                case 0 :
                    return "subhome_yellow_0" ;
                case 1 :
                    return "subhome_yellow_1" ;
                case 2 :
                    return "subhome_yellow_2" ;
                case 3 :
                    return "subhome_yellow_3" ;
                default:
                    console.log("Mauvais indice subhome !");
            }

        case "green" :
            switch (n) {
                case 0 :
                    return "subhome_green_0" ;
                case 1 :
                    return "subhome_green_1" ;
                case 2 :
                    return "subhome_green_2" ;
                case 3 :
                    return "subhome_green_3" ;
                default:
                    console.log("Mauvais indice subhome !");
            }
        
        default:
            console.log("Mauvaise couleur !");
    }
}

// for(let i = 0 ; i < 4 ; i++) {
//     document.getElementById(idHome("blue",i)).innerText = `${i}` ;
// }






function idCenter() {
    return "center" ;
}