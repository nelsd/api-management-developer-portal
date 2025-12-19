@REM This script automates content migration between developer portal instances.
@REM Make sure you're logged-in with `az login` command before running the script.

node ./ExportSourceImportDest ^
--sourceSubscriptionId "Source subscription ID" ^
--sourceResourceGroupName "Source resource group name" ^
--sourceServiceName "Source Service Name" ^
--sourceServicePrincipal "Source Service Principal" ^
--sourceServicePrincipalSecret "Source Service Principal Secret" ^
--isSourceDownload true ^
--isDestUpload false