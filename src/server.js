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


app.post('/save-farmer', (req, res) => {
    const id = generateUniqueId('F');
    const { email, password, firstName, lastName, middleName, birthdate, sex, region, province, city, postalCode, barangay, streetDetails, phoneNumber, farmLocation, farmName, farmSize } = req.body;
    const farmer = {
        id, email, password, firstName, lastName, middleName, birthdate, sex, region, province, city, postalCode, barangay, streetDetails, phoneNumber, farmLocation, farmName, farmSize
    }    
    res.send(farmer);
});

app.get('/get-all-farmers', (req, res) => {
    res.send(null);
});

app.put('/get-farmer', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.delete('/delete-farmer', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.post('/save-harvest', (req, res) => {
    const id = generateUniqueId('H');
    const { farmerId, vegetableName, datePlanted, dateHarvested, fertilizerUsed, pesticidesUsed, kiloProduced, transportId } = req.body;
    const harvest = {
        farmerId, vegetableName, datePlanted, dateHarvested, fertilizerUsed, pesticidesUsed, kiloProduced, transportId
    };
    res.send(harvest);
});

app.put('/get-all-harvest', (req, res) => {
    const { farmerId } = req.body;
    res.send(farmerId);
});

app.put('/get-harvest', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.delete('/delete-harvest', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.post('/save-courier', (req, res) => {
    const id = generateUniqueId('C');
    const { email, password, fullName } = req.body;
    const courier = {
        email, password, fullName
    };
    res.send(courier);
});

app.get('/get-all-couriers', (req, res) => {
    res.send(null);
});

app.put('/get-courier', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.delete('/delete-courier', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.post('/save-batch', (req, res) => {
    const { id } = generateUniqueId('B');
    const { courierId, transportId } = req.body;
    const batch = {
        courierId, transportId
    };
    res.send(batch)
});

app.put('/get-all-batches', (req, res) => {
    const { courierId } = req.body;
    req.res(courierId);
});

app.get('/get-batch', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.post('/save-transport', (req, res) => {
    const { id } = generateUniqueId('T');
    const { batchId, harvestId, courierId, pickUpDate, deliveryDate, status } = req.body;
    const transport = {
        batchId, harvestId, courierId, pickUpDate, deliveryDate, status
    };
    res.send(transport);
});

app.put('/get-transport', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.delete('/delete-transport', (req, res) => {
    const { id } = req.body;
    res.send(id);
});

app.post('/update-transport-status', (req, res) => {
    const { id, status } = req.body;
    res.send(id, status);
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
