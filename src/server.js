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
 * /delete-transport    PUT [id]
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
    res.send("Hello World!");
})

app.listen(port, '0.0.0.0', async () => {
    console.log(`Server is running at ${ port }`);
});
