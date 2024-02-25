// Connection to our Cloud SQL Database instance will take place here
const { Connector, IpAddressTypes, AuthTypes } = require("@google-cloud/cloud-sql-connector")
const MySql = require('mysql2/promise')
const knex = require('knex')


async function GoogleCloudSQLInstance(databaseName) {

	try {

		console.log("Attempting to connect ... ");

		const connector = new Connector();

		// TODO new project so new config options
		const clientOptions = await connector.getOptions({
			instanceConnectionName : "saikawa-web-development:us-central1:air-emory-test-repo",
			authType : AuthTypes.IAM,
			//ipType : "PUBLIC"
		});


		// Client options are regarding to Cloud SQL access control
		const database = knex({
			client: "mysql2",
			connection: {
				...clientOptions,
				user : "internal-user",
				database : databaseName
			}
		});


		return { 
			database,
			async closeSQLConnection() {
				await database.destroy();
				connector.close();
			}
		}

	} catch (err) {
		console.log(err);
	}

}





module.exports = { GoogleCloudSQLInstance };
