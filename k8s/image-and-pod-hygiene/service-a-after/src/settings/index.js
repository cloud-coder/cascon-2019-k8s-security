
module.exports = {
	sslServerKeyPath: process.env.KEY_PATH || "./settings/sslcert/key.pem",
	sslServerCertPath: process.env.CERT_PATH || "./settings/sslcert/cert.pem",
	sslServerKeyPassphrase: process.env.KEY_PASSPHRASE || "pass"
}
