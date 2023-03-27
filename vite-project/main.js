// import {CasperClient,CasperServiceByJsonRPC, CLPublicKey,DeployUtil } from "casper-js-sdk";

//Create Casper client and service to interact with Casper node.
// const apiUrl = '<your casper node>';
// const casperService = new CasperServiceByJsonRPC(apiUrl);
// const casperClient = new CasperClient(apiUrl);

const btnConnect = document.getElementById("btnConnect");
btnConnect.addEventListener("click", async () => {
        window.casperlabsHelper.requestConnection();
})