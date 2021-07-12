const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const communeModel = require('./Model/communeModel');
const activityModel = require('./Model/activityModel')
const paymentModel = require('./Model/paymentModel');
const adminModel = require('./Model/adminModel');
const bcrypt = require('bcryptjs');

// connect to database

mongoose.connect("mongodb://localhost:27017/tax-commune", { useNewUrlParser: true }, { useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("I'm connected to the database")
    }
})

// create activity collection 

const addActivity = async () => {

    try {

        await activityModel.deleteMany({}).lean()

        await activityModel.insertMany([

            {
                name: "bijoutier",
                prix: 10
            },
            {
                name: "coiffeur",
                prix: 15
            },
            {
                name: "électricien",
                prix: 20
            },
            {
                name: "cuisinier",
                prix: 15
            },
            {
                name: "cordonnier",
                prix: 13
            },
            {
                name: "pharmacien",
                prix: 25
            },
            {
                name: "mécanicien",
                prix: 15
            },
            {
                name: "plombier",
                prix: 20
            },
            {
                name: "technicien",
                prix: 25
            },
            {
                name: "vendeur",
                prix: 18
            }
        ])

        console.log("The collection of Activity has being recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create activity collection 

const addCommune = async () => {

    try {

        await communeModel.deleteMany({}).lean()

        await communeModel.insertMany([

            {
                name: "Champs-elysées",
                information: "Les Champs-Élysées sont une avenue vraiment charmante : une scène de carte postale. Longue de près de 2 kilomètres, cette artère historique s'étend de la place de la Concorde au majestueux Arc de Triomphe. Bien qu'elle soit devenue depuis \"la plus belle avenue du monde\", les Champs-Élysées étaient autrefois un marécage. C'est au XVIIe siècle qu'André Le Nôtre, jardinier du Roi Soleil, en a tracé le chemin originel. Une légende est née. L'avenue n'a fait que s'embellir au fil des décennies."
            
            },
            {
                name: "Bagnolet",
                information: "La ville est située dans le Bassin parisien, dans la région Île-de-France. Elle est limitrophe de Paris, en banlieue est, dans le sud du département de la Seine-Saint-Denis. Elle fait partie de la petite couronne de Paris.Bagnolet est situé à moins de 6 km, à vol d'oiseau, de Notre-Dame de Paris1."
            },
            {
                name: "Les Lilas",
                information: "La ville est située sur la colline de Belleville dans la banlieue nord-est de Paris, au sud-ouest du département de la Seine-Saint-Denis. Sur son territoire se situe le point culminant du département, avec 131 mètres."
            },
            {
                name: "Alfortville",
                information: "Située au confluent de la Seine et de la Marne, Alfortville s’étire sur une longueur de 4,5 km pour une largeur qui varie de 0,5 km à 1 km. La commune est délimitée par la Marne au nord, qui la sépare de Charenton-le-Pont, la voie ferrée Paris-Lyon à l'est qui la sépare de Maisons-Alfort, l’A86 au sud, qui la sépare de Choisy-le-Roi et Créteil et la Seine à l'ouest qui la sépare de Vitry-sur-Seine et d'Ivry-sur-Seine."
            },
            {
                name: "Antony",
                information: "Antony est une commune française, sous-préfecture du département des Hauts-de-Seine, située dans la métropole du Grand Paris en région Île-de-France. Jusqu'en 1968, Antony faisait partie du département de la Seine. Arrosée par la Bièvre, affluent de la Seine, Antony est située à un carrefour de routes très importantes, notamment le grand axe nord-sud, qui existait déjà il y a 2 000 ans. Faiblement urbanisée jusqu'au début du xxe siècle, la ville s'est considérablement développée entre les deux guerres, sous l'impulsion de son sénateur-maire Auguste Mounié, passant de 4 000 à 20 000 habitants. Au début des années 1960, la population passe en très peu de temps de 25 000 à 50 000 habitants pour loger les rapatriés d'Algérie. Aujourd'hui intégrée dans l'agglomération parisienne, Antony s'y distingue notamment par la présence, dans le domaine de l'enseignement, de l'un des plus grands établissements privés de France, l'Institution Sainte-Marie, et, dans celui de la santé, par celle du plus grand établissement privé d'Île-de-France. Par ailleurs, concernant le logement, selon une enquête du magazine Le Point, elle se classerait en première position parmi les villes de France « où l’on vit le mieux »."
            },
            {
                name: "Bondy",
                information: "La commune dispose d'une gare desservie par les trains de la ligne E du RER en direction de Paris et de Chelles-Gournay. Les trains s'y arrêtent avec une fréquence d'un train toutes les sept minutes en heure de pointe et d'un train toutes les quinze minutes en heure creuse. La gare a aussi longtemps été l'un des terminus de la ligne de Bondy à Aulnay-sous-Bois jusqu'à son remplacement, en 2006, par un tram-train qui constitue la ligne 4 du tramway d'Île-de-France. Celui-ci s'arrête aussi à La Remise à Jorelle. La ville de Bondy doit être desservie par la ligne 15 du métro de Paris dans le cadre du Grand Paris Express à l'horizon 2025. Une station sera construite à la gare de Bondy ainsi qu'au Pont de Bondy, situé à proximité directe de la bordure occidentale de la ville de Bondy qui est déjà desservi par la ligne 1 du tramway d'Île-de-France."
            },
            {
                name: "La Courneuve",
                information: "La Courneuve est une commune de la Plaine de France située en proche banlieue nord de Paris, industrialisée dès le xixe siècle en raison de la présence de plusieurs voies ferrées. La ville est desservie par deux autoroutes (A86 et A1), ainsi que par les routes départementales D 902, D 986 et l'ancienne route nationale 301. La desserte en transports en commun est assurée par le RER, le métro, le tramway et des bus. Avec son sol marécageux, elle était baignée par le Croult, petite rivière affluent de la Seine transformée dès le début du xxe siècle en égout principalement pluvial, et qui inondait régulièrement la ville lors de ses crues. Busée et enterrée, il est envisagé de la découvrir. La Courneuve est marquée par l'importance des infrastructures de transport (autoroutes A1, A86 et leur raccordement, ligne de chemin de fer Paris-Laon, ligne de Grande Ceinture et leur liaison, le raccordement du Bas Martineau), ainsi que par la présence de grands ensembles, qui segmentent le tissu urbain et créent d'importantes coupures. Le parc Georges-Valbon occupe la partie nord de la commune. Il comprend une zone Natura 2000."
            },
            {
                name: "Epinay-Sur-Seine",
                information: "Le territoire communal est limité au sud par la Seine. Le territoire présente une dénivellation progressive du nord vers le sud, des versants du plateau de Montmorency en direction de la Seine. Trois ruisseaux s'écoulent sur le territoire communal : le ru des Econdeaux à l'ouest, il est également traversé sur toute sa longueur du nord au sud-est par un petit cours d'eau : le ru d'Enghien, ainsi que par son affluent, le ru des Haras ou ru d'Arra1. D'une longueur de 14,2 kilomètres, le ru d'Enghien prend sa source en forêt de Montmorency au nord de la commune dans le Val-d'Oise et se jette dans la Seine après avoir traversé, canalisé pour l'essentiel, les territoires de Montlignon, Margency, Enghien-les-Bains et Épinay-sur-Seine et alimenté l'étang de la chasse, en amont en forêt, puis les étangs du parc de Maugarny (en limite de Montlignon et Margency), ceux du parc de Bury à Margency et le bassin de retenue des Moulinets à Eaubonne. Il se dirige ensuite vers le lac d'Enghien avant d'atteindre Épinay2. Le ru des Haras ou ru d'Arra, d'une longueur de 6,3 kilomètres, naît dans le vallon des Haras à l'est de Montmorency (Val-d'Oise) et se jette dans le ru d'Enghien à peu de distance de la Seine après avoir traversé, en souterrain pour une grande part, les territoires de Groslay, Montmagny et Villetaneuse3. La Direction de l'eau et de l'assainissement du département de la Seine-Saint-Denis a engagé plusieurs études en vue de la requalification de ce ruisseau, notamment dans sa partie où il se trouve en limite communale de Montmagny et de Villetaneuse. La réalisation de ce projet implique une amélioration significative de la qualité de l'eau en amont."
            },
            {
                name: "Le Pré-Saint-Gervais",
                information: "La commune du Pré-Saint-Gervais est située en première couronne de l'agglomération parisienne, au nord-est de Paris, et au sud du département de la Seine-Saint-Denis. Elle est limitrophe au sud et à l'ouest de Paris, au nord et au nord-est de Pantin, et à l'est et au sud des Lilas. La commune est édifiée sur le flanc nord de la colline de Belleville. Le Pré-Saint-Gervais est, en superficie, la plus petite commune du département de la Seine-Saint-Denis, avec seulement 70 hectares. C'est d'autre part la commune de Seine-Saint-Denis avec la plus forte densité, et l'une les plus densément peuplées de France avec plus de 25 000 habitants au km². Elle est ainsi la dixième ville la plus densément peuplée du monde. La commune est longée par le boulevard périphérique de Paris et desservie par les sorties porte du Pré-Saint-Gervais (sortie chaussée intérieure), porte des Lilas ou encore porte de Pantin. De plus, la porte Chaumont lie Paris au Pré-Saint-Gervais mais sans accès au périphérique. De même, le passage Brunet permet les accès piétons sous le périphérique au niveau de la porte Brunet."
            }
        ])

        console.log("The collection of Commune has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create user collection 

const addUser = async () => {

    const password = "!As123456"
    const passwordHash = bcrypt.hashSync(password)

    try {

        const communeDetails = await communeModel.findOne({ name: "champs-elysées" }).lean()     // take commune id to save in with user collection
        
        const activityDetails = await activityModel.findOne({ name: "vendeur" }).lean()  // take activity id to save in with user collection
        
        await userModel.deleteMany({}).lean()

        await userModel.insertMany([

            {
                surname: "john",
                firstname: "alex",
                dateofbirth: "2000/12/12",
                address_personal: "12 elyse palace",
                address_activity: "paris",
                activity_communeID: communeDetails._id,
                activityID: activityDetails._id,
                telephone: "148381111",
                password: passwordHash
            }
        ])

        console.log("The collection of User has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create admin collection

const addAdmin = async () => {

    const password = "!As123456"
    const passwordHash = bcrypt.hashSync(password)

    try {

        await adminModel.deleteMany({}).lean()

        await adminModel.insertMany([

            {
                firstname: "lean",
                surname: "leandro",
                role: "1",
                telephone: "248382222",
                password: passwordHash
            },
            {
                firstname: "ahmed",
                surname: "ahmed",
                role: "2",
                telephone: "348383333",
                password: passwordHash
            }
        ])

        console.log("The collection of admin has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create payment collection

const addPayment = async () => {
    
    try {
        
        const defaultUser = "148381111";    // user signed in telephone number
        
        const userDetails = await userModel.findOne({ telephone: defaultUser }).lean()     // take commune id to save in with user collection
         
        await paymentModel.deleteMany({}).lean()
        
        await paymentModel.insertMany([
            
            {
                userId: userDetails._id,
                amount: "5",
                paidon: new Date()
            }
        ])
        
        console.log("The collection of Payment has been recreated with the database");
        
        
    } catch (err) {
        console.log(err)
    }
}

addAdmin();

addActivity();

addCommune();

setTimeout(function () { addUser() }, 3000);        // will wait to get updated activity/commune collection to avoid promise error

setTimeout(function () { addPayment() }, 7000 );     // delay is to avoid any error collection