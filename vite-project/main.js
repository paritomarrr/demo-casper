import {CasperClient,CasperServiceByJsonRPC, CLPublicKey,DeployUtil } from "casper-js-sdk";

//Create Casper client and service to interact with Casper node.
const apiUrl = 'https://rpc.testnet.casperlabs.io/rpc';
// const casperService = new CasperServiceByJsonRPC(apiUrl);
const casperClient = new CasperClient(apiUrl);

const btnConnect = document.getElementById("btnConnect");
btnConnect.addEventListener("click", async () => {
        window.casperlabsHelper.requestConnection();
})

const btnDisconnect = document.getElementById("btnDisconnect");
btnDisconnect.addEventListener("click", () => {
        window.casperlabsHelper.disconnectFromSite();
})

async function sendTransaction(){
        // get address to send from input.
        const to = document.getElementById("Recipient").value;
        // get amount to send from input.
        const amount = document.getElementById("Amount").value
        // For native-transfers the payment price is fixed.
        const paymentAmount = 10000000000;
        
        // transfer_id field in the request to tag the transaction and to correlate it to your back-end storage.
        const id = 287821;
        
        // gasPrice for native transfers can be set to 1.
        const gasPrice = 1;
        
        // Time that the deploy will remain valid for, in milliseconds
        // The default value is 1800000 ms (30 minutes).
        const ttl = 1800000;
        const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
        const publicKey = CLPublicKey.fromHex(publicKeyHex)
        
        let deployParams = new DeployUtil.DeployParams(publicKey,"casper-test",gasPrice,ttl );
        
        // We create a public key from account-address (it is the hex representation of the public-key with an added prefix).
        const toPublicKey = CLPublicKey.fromHex(to);
        
        const session = DeployUtil.ExecutableDeployItem.newTransfer( amount,toPublicKey,null,id);
        
        const payment = DeployUtil.standardPayment(paymentAmount);
        const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        
        // Turn your transaction data to format JSON
        const json = DeployUtil.deployToJson(deploy)
        
        // Sign transcation using casper-signer.
        const signature = await window.casperlabsHelper.sign(json,publicKeyHex,to)
        const deployObject = DeployUtil.deployFromJson(signature)
        
        // Here we are sending the signed deploy.
        const signed = await casperClient.putDeploy(deployObject.val);
        
        // Display transaction address
        const tx = document.getElementById("tx")
        tx.textContent = `tx: ${signed}`
        console.log("transaction",signature)
        }
        
        const btnSend = document.getElementById("btnSend")
        btnSend.addEventListener("click",async () => await sendTransaction())