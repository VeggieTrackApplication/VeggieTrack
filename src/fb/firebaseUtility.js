const firebase = require('firebase-admin/app');
const fs = require('firebase-admin/firestore');
const admin = require('firebase-admin');

const serviceAccount = require('./veggietrack-7a045-firebase-adminsdk-uf0zv-e1414b8b49.json');

firebase.initializeApp({
    credential: firebase.cert(serviceAccount),
    storageBucket: 'gs://veggietrack-7a045.appspot.com'
});

const db = fs.getFirestore();
const bucket = admin.storage().bucket();

const farmerNode = 'farmer';
const harvestNode = 'harvest';
const courierNode = 'courier';
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
        console.log('error: ', error.message);
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
                return '0';
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
        response.forEach((data) => {
            if (data.farmerId == farmerId) {
                returnValue.push(data);
            }
        });
        return returnValue;
    } catch (error) {
        console.log('error: ', error.message);
        return null;
    }
};

const getHarvest = async (id) => {
    const harvestResponse = await getSingleData(harvestNode, id);
    if(harvestResponse.transportId == '0') {
        return harvestResponse;
    }
    const transportResponse = await getSingleData(transportNode, harvestResponse.transportId);
    const courierResponse = await getSingleData(courierNode, transportResponse.courierId);
    return {
        ...harvestResponse,
        transport: transportResponse,
        courier: courierResponse
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
            returnValue.push(querySnapshot.docs[i].data());
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
        const currentDate = new Date();
        const formattedDate = currentDate.getFullYear() + '-' +
            String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(currentDate.getDate()).padStart(2, '0');
        await db.collection(transportNode).doc(String(id)).update({ status, deliveryDate: formattedDate});
        return id;
    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }
};

const saveTransactionLocationFile = async (transactionId, originalname, filePath) => {
    try {
        const destination = `${transactionId}/${originalname}`; // Firebase destination
        
        await bucket.upload(filePath, {
            destination: destination
        });

        return 'success';
    } catch (error) {
        console.log('error: ', error.message);
        return 'failed';
    }
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

    saveBatch,
    getBatches,
    getBatch,

    saveTransport,
    getTransport,
    deleteTransport,
    updateTransportStatus,
    getUndeliveredTransports,

    saveTransactionLocationFile
};