import {CasperClient,CasperServiceByJsonRPC, CLPublicKey,DeployUtil } from "casper-js-sdk";
// import {Signer} from "casper-js-sdk/utils/signer"

//Create Casper client and service to interact with Casper node.
const apiUrl = 'https://rpc.testnet.casperlabs.io/rpc';
const casperService = new CasperServiceByJsonRPC(apiUrl);
const casperClient = new CasperClient(apiUrl);
// let request = new XMLHttpRequest();
// request.setRequestHeader("Access-Control-Allow-Origin", "https://rpc.testnet.casperlabs.io/rpc");

const btnConnect = document.getElementById("btnConnect");
btnConnect.addEventListener("click", async () => {
        window.casperlabsHelper.requestConnection();
        await AccountInformation();
})

const btnDisconnect = document.getElementById("btnDisconnect");
btnDisconnect.addEventListener("click", () => {
        window.casperlabsHelper.disconnectFromSite();
})

async function AccountInformation(){
        const isConnected = await window.casperlabsHelper.isConnected()
        if(isConnected){
                const publicKey = await window.casperlabsHelper.getActivePublicKey();
                textAddress.textContent += publicKey;

                const latestBlock = await casperService.getLatestBlockInfo();
                const root = await casperService.getStateRootHash(latestBlock.block.hash);

                const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
                        root,
                        CLPublicKey.fromHex(publicKey)
                        )

                //account balance from the last block
                const balance = await casperService.getAccountBalance(
                        latestBlock.block.header.state_root_hash,
                        balanceUref
                );
                textBalance.textContent = `PublicKeyHex ${balance.toString()}`;
        }
}





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


        // const signer = new Signer(casperClient)
        // console.log('Singerr', signer)
        // Sign transcation using caspecr-signer.
        const signature = await window.casperlabsHelper.sign(json,publicKeyHex,to)
        console.log('Signature', signature)

        
        const deployObject = DeployUtil.deployFromJson(signature)
        console.log('Deploy', deployObject)
      
            
       
        // Here we are sending the signed deploy.
        const header = deployObject.val.header
        const paymentt = deployObject.val.payment
        const sessionn = deployObject.val.session
        const objctDemo = {header, payment, session}
        const signed = await casperClient.putDeploy(deployObject.val);

        console.log('signed', signed)
        
        // Display transaction address
        const tx = document.getElementById("tx")
        tx.textContent = `tx: ${signed}`
        console.log("transaction",signature)
        }
        
        const btnSend = document.getElementById("btnSend")
        btnSend.addEventListener("click",async () => await sendTransaction())