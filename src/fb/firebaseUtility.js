const firebase = require('firebase-admin/app');
const fs = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const fsFile = require('fs');
const path = require('path');
const fs2 = require('fs');
require('dotenv').config();

const isRender = process.env.DEV_ENV === 'production';

let serviceAccount;

if (isRender) {
    serviceAccount = JSON.parse(fs2.readFileSync('/etc/secrets/pk.json', 'utf8'));
} else {
    serviceAccount = JSON.parse(fs2.readFileSync(path.join(__dirname, '/etc/secrets/pk.json') , 'utf8'));
}


firebase.initializeApp({
    credential: firebase.cert(serviceAccount),
    storageBucket: 'gs://veggietrack-7a045.appspot.com'
});

const db = fs.getFirestore();
const bucket = admin.storage().bucket();

const farmerNode = 'farmer';
const harvestNode = 'harvest';
const courierNode = 'courier';
const retailerNode = 'retailer';
const batchNode = 'batch';
const transportNode = 'transport';

const saveData = async (dataType, data) => {
    const { id } = data;

    try {
        await db.collection(dataType).doc(String(id)).set(data);
        return 'success';
    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }
};

const updateData = async (dataType, data) => {
    const { id } = data;

    try {
        await db.collection(dataType).doc(String(id)).update(data);
        return 'success';
    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }
};

const getData = async (dataType) => {
    try {
        const response = await db.collection(dataType).get();
        return response.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.log(error);
        console.log('error getting data: ', error.message);
        return null;
    }
};

const getSingleData = async (dataType, id) => {
    try {
        const response = await db.collection(dataType).doc(String(id)).get();
        return { id: response.id, ...response.data() };
    } catch (error) {
        console.log('error: ', error.message);
        return null;
    }
}

const deleteData = async (dataType, id) => {
    try {
        await db.collection(dataType).doc(String(id)).delete();
        return 'success';
    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }

};

const checkLogin = async (email, password) => {
    try {
        const querySnapshot = await db.collection("farmer").where('email', '==', email.toLowerCase()).where('password', '==', password).get();
        if (querySnapshot.empty) {
            const newQuerySnapshot = await db.collection("courier").where('email', '==', email).where('password', '==', password).get();
            if (newQuerySnapshot.empty) {
                const newNewQuerySnapshot = await db.collection("retailer").where('email', '==', email).where('password', '==', password).get();
                if (newNewQuerySnapshot.empty) {
                    return '0';
                } else {
                    return newNewQuerySnapshot.docs[0].id;
                }
            } else {
                return newQuerySnapshot.docs[0].id;
            }
        } else {
            return querySnapshot.docs[0].id;
        }
    } catch (error) {
        console.log('error: ', error.message);
    }
};

const saveFarmer = async (farmer) => {
    return await saveData(farmerNode, farmer);
};

const getFarmers = async () => {
    return await getData(farmerNode);
};

const getFarmer = async (id) => {
    return await getSingleData(farmerNode, id);
};

const deleteFarmer = async (id) => {
    return await deleteData(farmerNode, id);
};

const saveHarvest = async (harvest) => {
    return await saveData(harvestNode, harvest);
};

const getHarvests = async (farmerId) => {
    try {
        const returnValue = [];
        const response = await getData(harvestNode);
        for (let i = 0; i < response.length; i++) {
            const data = response[i];
            if (data.farmerId == farmerId) {
                if (data.transportId != '0') {
                    data.transport = await getTransport(data.transportId);
                    data.transport.harvest = {};
                }
                returnValue.push(data);
            }
        }
        return returnValue;
    } catch (error) {
        console.log('error: ', error.message);
        return null;
    }
};

const getHarvest = async (id) => {
    console.log('id', id);
    const harvestResponse = await getSingleData(harvestNode, id);
    console.log('harvestResponse', harvestResponse);
    if(harvestResponse.transportId == '0') {
        return harvestResponse;
    }

    const transportResponse = await getSingleData(transportNode, harvestResponse.transportId);
    const courierResponse = await getSingleData(courierNode, transportResponse.courierId);
    const transportLocation = await getTransportLocation(transportResponse.id);
    return {
        ...harvestResponse,
        transport: transportResponse,
        courier: courierResponse,
        transportLocation: transportLocation == 'failed' ? 'No data' : await parseLocations(await transportLocation)
    }
};

const deleteHarvest = async (id) => {
    return await deleteData(harvestNode, id);
};

const updateHarvestTransportId = async (harvest) => {
    return await updateData(harvestNode, harvest);
};

const saveCourier = async (courier) => {
    return await saveData(courierNode, courier);
};

const saveRetailer = async (retailer) => {
    return await saveData(retailerNode, retailer);
}

const getCouriers = async () => {
    return await getData(courierNode);
};

const getCourier = async (id) => {
    return await getSingleData(courierNode, id);
};

const deleteCourier = async (id) => {
    return await deleteData(courierNode, id);
};

const saveBatch = async (batch) => {
    return await saveData(batchNode, batch);
};

const getBatches = async (courierId) => {
    try {
        const returnValue = [];
        const querySnapshot = await db.collection(batchNode).where('courierId', '==', courierId).get();
        for(var i = 0; i < querySnapshot.size; i++) {
            const batch = querySnapshot.docs[i].data();
            batch.status = 2;
            for (var j = 0; j < batch.transportIds.length; j++) {
                const transport = await getTransport(batch.transportIds[j]);
                transport.harvest = {};
                
                if (batch.status > transport.status) {
                    batch.status = transport.status;
                }
            }
            returnValue.push(batch);
        }
        return returnValue;
    } catch (error) {
        console.log('error: ', error.message);
        return null;
    }
};

const getBatch = async (id) => {
    return await getSingleData(batchNode, id);
};

const saveTransport = async (transport) => {
    return await saveData(transportNode, transport);
};

const getTransport = async (id) => {
    const transport = await getSingleData(transportNode, id);
    const harvest = await getSingleData(harvestNode, transport.harvestId);
    return {
        ...transport,
        harvest
    }
};

const getUndeliveredTransports = async (courierId) => {
    const querySnapshot = await db.collection(transportNode).where('courierId', '==', courierId).where('status', '==', 1).get();
    const returnValue = [];
    for(var i = 0; i < querySnapshot.size; i++) {
        returnValue.push(querySnapshot.docs[i].data());
    }
    return returnValue;
};

const deleteTransport = async (id) => {
    return await deleteData(transportNode, id);
};

const updateTransportStatus = async (id, status) => {
    try {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentDate = new Date();
          
        const formattedDate = months[currentDate.getMonth()] + ' ' +
            String(currentDate.getDate()).padStart(2, '0') + ', ' +
            currentDate.getFullYear();

        await db.collection(transportNode).doc(String(id)).update({ status, deliveryDate: formattedDate});
        return id;
    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }
};

const saveTransactionLocationFile = async (transactionId, originalname, filePath) => {
    try {
        const destination = `${transactionId}/${originalname}`;
        
        await bucket.upload(filePath, {
            destination: destination
        });

        return 'success';
    } catch (error) {
        console.log('error saving file location: ', error.message);
        return 'failed';
    }
}

const saveImage = async (filename, filePath) => {
    try {
        await bucket.upload(filePath, {
            destination: filename
        });

        return 'success';
    } catch (error) {
        console.log('error saving file image: ', error.message);
        return 'failed';
    }
}

const saveProof = async (file, fileName) => {
    try {
        await bucket.upload(file.path, {
            destination: fileName
        });
        return 'success';
    } catch (error) {
        return 'failed';
    }
}

const getTransportLocation = async (transactionId) => {

    const destination = `${ transactionId }/${transactionId}_location.txt`;
    const destinationPath = path.join(__dirname, `${ transactionId }_location.txt`);
    
    try {

        await bucket.file(destination).download({ destination: destinationPath });

        const data = await fsFile.readFileSync(destinationPath, 'utf8');

        await fsFile.unlinkSync(destinationPath);

        return data;

    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }
}

const downloadImage = async (fileName) => {
    try {
        const file = bucket.file(fileName);
        const [download] = await file.download();

        return download;

    } catch (error) {
        console.log('error: ', error.message);
        return null;
    }

};

const parseLocations = async (locationData) => {

    const locations = [];
    const lines = locationData.split('\n');

    for(var i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
            const latMatch = line.match(/Lat: ([\d.]+)/);
            const longMatch = line.match(/Long: ([\d.]+)/);
            const timeMatch = line.match(/Time: (\d+)/);

            const goodLat = latMatch[1];
            const goodLng = longMatch[1];
            const goodTime = (line.split(',')[2]).trim().substring(6);

            if (goodLat && goodLng && goodTime) {
                locations.push({
                    lat: parseFloat(goodLat),
                    long: parseFloat(goodLng),
                    time: goodTime,
                });
            }
        }
    }

    return locations;
}

module.exports = {
    checkLogin,

    saveFarmer,
    getFarmers,
    getFarmer,
    deleteFarmer,

    saveHarvest,
    getHarvests,
    getHarvest,
    deleteHarvest,
    updateHarvestTransportId,

    saveCourier,
    getCouriers,
    getCourier,
    deleteCourier,

    saveRetailer,

    saveBatch,
    getBatches,
    getBatch,

    saveTransport,
    getTransport,
    deleteTransport,
    updateTransportStatus,
    getUndeliveredTransports,

    saveTransactionLocationFile,
    saveImage,
    saveProof,

    downloadImage
};