/**
 * This script automates deployments between developer portal instances.
 * In order to run it, you need to:
 * 
 * 1) Clone the api-management-developer-portal repository:
 *    git clone https://github.com/Azure/api-management-developer-portal.git
 * 
 * 2) Install NPM  packages:
 *    npm install
 * 
 * 3) Run this script with a valid combination of arguments:
 *    node ./ExportSourceImportDest ^
 *    --sourceSubscriptionId "< optional your subscription ID >" ^
 *    --sourceResourceGroupName "< optional your resource group name >" ^
 *    --sourceServiceName "< optional your service name >" ^
 *    --sourceTenantId "< optional (needed if source and destination is in different subscription) source tenant ID >" ^
 *    --sourceServicePrincipal "< optional (needed if source and destination is in different subscription) source service principal or user name. >" ^
 *    --sourceServicePrincipalSecret "< optional (needed if source and destination is in different subscription) secret or password for service principal or az login for the source apim. >" ^
 *    --destSubscriptionId "< optional your subscription ID >" ^
 *    --destResourceGroupName "< optional your resource group name >" ^
 *    --destServiceName "< optional your service name >"
 *    --destTenantId "< optional (needed if source and destination is in different subscription) destination tenant ID >"
 *    --destServicePrincipal "< optional (needed if source and destination is in different subscription)destination service principal or user name. >"
 *    --destServicePrincipalSecret "< optional (needed if source and destination is in different subscription) secret or password for service principal or az login for the destination. >"
 *    --isSourceDownload "< (needed if only source download is required) set to true to download only from source. >"
 *    --isDestUpload "< (needed if only Destination upload is required) set to true to upload only to destination. >"
 * Auto-publishing is not supported for self-hosted versions, so make sure you publish the portal (for example, locally)
 * and upload the generated static files to your hosting after the migration is completed.
 * 
 * You can specify the SAS tokens directly (via sourceToken and destToken), or you can supply an identifier and key,
 * and the script will generate tokens that expire in 1 hour. (via sourceId, sourceKey, destId, destKey)
 */

const { ImporterExporter } = require('./utils.js');

const yargs = require('yargs')
    .example(`node ./ExportSourceImportDest ^ \r
    *    --sourceSubscriptionId "< optionalyour subscription ID > \r
    *    --sourceResourceGroupName "< optional your resource group name > \r
    *    --sourceServiceName "< optionalyour service name > \r
    *    --sourceTenantId "< optional (needed if source and destination is in different subscription) source tenant ID > \r
    *    --sourceServicePrincipal "< optional (needed if source and destination is in different subscription) source service principal or user name. > \r
    *    --sourceServicePrincipalSecret "< optional (needed if source and destination is in different subscription) secret or password for service principal or az login for the source apim. > \r
    *    --destSubscriptionId "< optionalyour subscription ID > \r
    *    --destResourceGroupName "< optionalyour resource group name > \r
    *    --destServiceName "< optionalyour service name > \r
    *    --destTenantId "< optional (needed if source and destination is in different subscription) destination tenant ID > \r
    *    --destServicePrincipal "< optional (needed if source and destination is in different subscription) destination service principal or user name. > \r
    *    --destServicePrincipalSecret "< optional (needed if source and destination is in different subscription) secret or password for service principal or az login for the destination. > \r
    *    --isSourceDownload "< (needed if only source download is required) set to true to download only from source. > \r
    *    --isDestUpload "< (needed if only Destination upload is required) set to true to upload only to destination. >\n`)
    .option('sourceSubscriptionId', {
        type: 'string',
        description: 'Azure subscription ID.',
        demandOption: false
    })
    .option('sourceResourceGroupName', {
        type: 'string',
        description: 'Azure resource group name.',
        demandOption: false
    })
    .option('sourceServiceName', {
        type: 'string',
        description: 'API Management service name.',
        demandOption: false
    })
    .option('sourceTenantId', {
        type: 'string',
        description: 'source tenant ID.',
        demandOption: false
    })
    .option('sourceServicePrincipal', {
        type: 'string',
        description: 'source service principal ID.',
        demandOption: false
    })
    .option('sourceServicePrincipalSecret', {
        type: 'string',
        description: 'source service principal secret.',
        demandOption: false
    })
    .option('destSubscriptionId', {
        type: 'string',
        description: 'Azure subscription ID.',
        demandOption: false
    })
    .option('destResourceGroupName', {
        type: 'string',
        description: 'Azure resource group name.',
        demandOption: false
    })
    .option('destServiceName', {
        type: 'string',
        description: 'API Management service name.',
        demandOption: false
    })
    .option('destTenantId', {
        type: 'string',
        description: ' destination tenantId.',
        demandOption: false
    })
    .option('destServicePrincipal', {
        type: 'string',
        description: 'destination service principal or user name.',
        demandOption: false
    })
    .option('destServicePrincipalSecret', {
        type: 'string',
        description: 'destination service principal secret.',
        demandOption: false
    })
    .option('isSourceDownload', {
        type: 'boolean',
        description: 'set to true to download only from source.',
        demandOption: true
    })
    .option('isDestUpload', {
        type: 'boolean',
        description: 'set to true to upload only to destination.',
        demandOption: true
    })
    .help()
    .argv;

async function ExportSourceImportDest() {
    try {

        if (yargs.isSourceDownload) {
            console.log("isSourceDownload");
            const sourceImporterExporter = new ImporterExporter(yargs.sourceSubscriptionId, yargs.sourceResourceGroupName, yargs.sourceServiceName, yargs.sourceTenantId, yargs.sourceServicePrincipal, yargs.sourceServicePrincipalSecret);
            console.log("Now exporting...");
            await sourceImporterExporter.export();
            console.log("isSourceDownload::export completed.");
        }

        if (yargs.isDestUpload) {
            console.log("isDestUpload");
            const destImporterExporter = new ImporterExporter(yargs.destSubscriptionId, yargs.destResourceGroupName, yargs.destServiceName, yargs.destTenantId, yargs.destServicePrincipal, yargs.destServicePrincipalSecret);
            console.log("Now cleaning up...");
            await destImporterExporter.cleanup();
            console.log("isDestUpload::cleanup completed.");
            console.log("Now Importing");
            await destImporterExporter.import();
            console.log("isDestUpload::import completed.");
            console.log("Now publishing...");
            await destImporterExporter.publish();
            console.log("isDestUpload::publish completed.");
        }
    } 
    catch (error) {
        throw new Error(`Unable to complete migration. ${error.message}`);
    }
}

ExportSourceImportDest()
    .then(() => {
        console.log("DONE");
        process.exit(0);
    })
    .catch(error => {
        console.error(error.message);
        process.exit(1);
    });