/**
 * ---FARMER---
 * id               :number
 * email            :string
 * password         :string
 * firstName        :string
 * lastName         :string
 * middleName       :string
 * birthdate        :string
 * sex              :string
 * region           :string
 * province         :string
 * city             :string
 * postalCode       :string
 * barangay         :string
 * streetDetails    :string
 * phoneNumber      :string
 * farmLocation     :string
 * farmName         :string
 * farmSize         :string
 * 
 * ---HARVEST---
 * id               :number
 * farmerId         :number
 * vegetableName    :string
 * datePlanted      :string
 * dateHarvested    :string
 * fertilizerUsed   :string[]
 * pesticidesUsed   :string[]
 * kiloProduced     :string
 * transportId      :number
 * 
 * ---TRANSPORT---
 * id               :number
 * batchId          :number
 * harvestId        :number[]
 * courierId        :number
 * pickUpDate       :string
 * deliveryDate     :string | nullable
 * status           :string
 * 
 * ---BATCH---
 * id               :number
 * courierId        :number
 * transportId      :number[]
 * 
 * ---COURIER---
 * id               :number
 * email            :string
 * password         :string
 * fullName         :string
 * 
 * FUNCTIONS AND APIs
 * 
 * const response = await anyFunction(...);
 * res.send(response);
 * RETURN value is always response
 * 
 * /login               POST [email, password]
 * fb.checkLogin(email, password); === 0 if no user, id if there's a user
 * 
 * FOR FARMER
 * /save-farmer         POST [...]
 * /get-all-farmers     GET
 * /get-farmer          PUT [id]
 * /delete-farmer       DELETE [id]
 * 
 * fb.saveFarmer(...); -> FOR ADD and UPDATE
 * fb.getFarmers(); === Array of Farmers [{...}, {...}, {...}]
 * fb.getFarmer(id); === Farmer {...}
 * fb.deleteFarmer(id);
 * 
 * FOR HARVEST
 * /save-harvest        POST [...]
 * /get-all-harvests    PUT [farmerId]
 * /get-harvest         PUT [id]
 * /delete-harvest      DELETE [id]
 * 
 * fb.saveHarvest(...); -> FOR ADD and UPDATE
 * fb.getHarvests(farmerId); === Array of Harvests [{...}, {...}, {...}]
 * fb.getHarvest(id); === Harvest {...}
 * fb.deleteHarvest(id);
 * 
 * FOR COURIER
 * /save-courier        POST [...]
 * /get-all-couriers    GET
 * /get-courier         PUT [id]
 * /delete-courier      DELETE [id]
 * 
 * fb.saveCourier(...); -> FOR ADD and UPDATE
 * fb.getCouriers(); === Array of Couriers [{...}, {...}, {...}]
 * fb.getCourier(id); === Courier {...}
 * fb.deleteCourier(id);
 * 
 * FOR COURIER -> BATCH
 * /save-batch          POST [...]
 * /get-all-batches     PUT [courierId]
 * /get-batch           PUT [id]
 * 
 * fb.saveBatch(...); -> FOR ADD AND UPDATE
 * fb.getBatches(courierId); === Array of Batches [ {[ {...}, {...}, {...} ]}, {[ {...}, {...}, {...} ]}, {[ {...}, {...}, {...} ]} ]
 * fb.getBatch(id); === Batch [{...}, {...}, {...}]
 * 
 * FOR COURIER -> TRANSPORTS
 * /save-transport      POST [...]
 * /get-transport       PUT [id]
 * /delete-transport    DELETE [id]
 * /update-transport-status POST [id, status]
 * 
 * fb.saveTransport(...); -> FOR ADD and UPDATE
 * fb.getTransport(id); === Transport {...}
 * fb.deleteTransport(id);
 * fb.updateTransportStatus(id, status);
 * 
 * 
 * EMAIL: veggietrack@gmail.com
 * PASSWORD: VeggieTrackApplication
 */

const express = require('express');
const path = require('path');
const fb = require('./fb/firebaseUtility');
const app = express();

const port = 8080;

const publicPath = path.resolve(__dirname, 'public');

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    //body {id, name, email, password, ...}
    // const { id, name, email, password } = req.body;
    // generateUniqueId('F');

    res.send("Hello World!");
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    res.send(email + " " + password);
});


app.post('/save-farmer', async (req, res) => {
    const id = generateUniqueId('F');
    const { email, password, firstName, lastName, middleName, birthdate, sex, region, province, city, postalCode, barangay, streetDetails, phoneNumber, farmLocation, farmName, farmSize } = req.body;
    const farmer = {
        id, email, password, firstName, lastName, middleName, birthdate, sex, region, province, city, postalCode, barangay, streetDetails, phoneNumber, farmLocation, farmName, farmSize
    }
    const response = await fb.saveFarmer(farmer);
    res.send(response);
});

app.get('/get-all-farmers', async (req, res) => {
    const response = await fb.getFarmers();
    res.send(response);
});

app.put('/get-farmer', async (req, res) => {
    const { id } = req.body;
    const response = await fb.getFarmer(id);
    res.send(response);
});

app.delete('/delete-farmer', async (req, res) => {
    const { id } = req.body;
   const response = await fb.deleteFarmer(id);
    res.send(response);
});

app.post('/save-harvest', async (req, res) => {
    const id = generateUniqueId('H');
    const { farmerId, vegetableName, datePlanted, dateHarvested, fertilizerUsed, pesticidesUsed, kiloProduced, transportId } = req.body;
    const harvest = {
        farmerId, vegetableName, datePlanted, dateHarvested, fertilizerUsed, pesticidesUsed, kiloProduced, transportId
    };
    const response = await fb.saveHarvest(harvest);
    res.send(response);
});

app.put('/get-all-harvest', async (req, res) => {
    const { farmerId } = req.body;
    const response = await fb.getHarvests(farmerId);
    res.send(response);
});

app.put('/get-harvest', async (req, res) => {
    const { id } = req.body;
    const response = await fb.getHarvest(id);
    res.send(response);
});

app.delete('/delete-harvest', async (req, res) => {
    const { id } = req.body;
    const response = await fb.deleteHarvest(id);
    res.send(response);
});

app.post('/save-courier', async (req, res) => {
    const id = generateUniqueId('C');
    const { email, password, fullName } = req.body;
    const courier = {
        email, password, fullName
    };
    const response = await fb.saveCourier(courier);
    res.send(response);
});

app.get('/get-all-couriers', async (req, res) => {
    const response = await fb.getCouriers();
    res.send(response);
});

app.put('/get-courier', async (req, res) => {
    const { id } = req.body;
    const response = await fb.getCourier(id);
    res.send(response);
});

app.delete('/delete-courier', async (req, res) => {
    const { id } = req.body;
    const response = await fb.deleteCourier(id)
    res.send(response);
});

app.post('/save-batch', async (req, res) => {
    const { id } = generateUniqueId('B');
    const { courierId, transportId } = req.body;
    const batch = {
        courierId, transportId
    };
    const response = await fb.saveBatch(batch);
    res.send(response);
});

app.put('/get-all-batches', async (req, res) => {
    const { courierId } = req.body;
    const response = await fb.getBatches(courierId);
    req.res(response);
});

app.get('/get-batch', async (req, res) => {
    const { id } = req.body;
    const response = await fb.getBatch(id)
    res.send(response);
});

app.post('/save-transport', async (req, res) => {
    const { id } = generateUniqueId('T');
    const { batchId, harvestId, courierId, pickUpDate, deliveryDate, status } = req.body;
    const transport = {
        batchId, harvestId, courierId, pickUpDate, deliveryDate, status
    };
    const response = await fb.saveTransport(transport);
    res.send(response);
});

app.put('/get-transport', async (req, res) => {
    const { id } = req.body;
    const response = await fb.getTransport(id);
    res.send(response);
});

app.delete('/delete-transport', async (req, res) => {
    const { id } = req.body;
    const response = await fb.deleteTransport(id);
    res.send(response);
});

app.post('/update-transport-status', async (req, res) => {
    const { id, status } = req.body;
    const response = await fb.updateTransportStatus(id, status);
    res.send(response);
});

function generateUniqueId(idType) {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${idType.toUpperCase()}${year}${month}${day}-${hours}${minutes}${seconds}-${milliseconds}`;
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at ${ port }`);
});
