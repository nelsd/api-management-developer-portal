@REM This script automates content migration between developer portal instances.
@REM Make sure you're logged-in with `az login` command before running the script.

node ./ExportSourceImportDest ^
--destSubscriptionId "Destination subscription ID" ^
--destResourceGroupName "Destination resource group name" ^
--destServiceName "Destination APIM service name" ^
--destServicePrincipal "Destination Service Principal" ^
--destServicePrincipalSecret "Destination Service Principal Secret" ^
--isSourceDownload false ^
--isDestUpload true