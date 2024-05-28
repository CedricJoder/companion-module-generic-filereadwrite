const { InstanceStatus } = require('@companion-module/base')

const fs = require('fs');
const readline = require('readline');

module.exports = {
	openFile() {
		let self = this; // required to have reference to outer `this`
		
		const rate = self.config.rate;

		self.readFile();
		self.updateStatus(InstanceStatus.Ok);
					

		if (rate > 0) {
			if (self.config.verbose) {
				self.log('debug', 'Creating Interval. File will be read every ' + rate + ' ms.');
			}
			self.INTERVAL = setInterval(self.readFile.bind(self), rate);
		}
		else {
			self.log('info', 'Retry Rate is 0. Module will open file one time and not read it again unless manually activated.');
		}
	},

	readFile() {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
					self.log('error', 'Error reading file: ' + err);
					self.stopInterval();
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
					self.filecontents = data;
					self.datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);
					self.checkVariables();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading File: ' + error);
		}
	},

	writeFile() {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.writeFile(path, self.writebuffer, {encoding:encoding}, (err) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
					self.log('error', 'Error writding file: ' + err);
					self.stopInterval();
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
					self.datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);
					self.checkVariables();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Writing File: ' + error);
		}
	},


	setWritebuffer(data) {
		let self = this;
		self.writebuffer = data;
	},

	appendFile(data) {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}

			fs.open(path, 'a', (err, fd) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Opening File');
					self.log('error', 'Error opening file: ' + err);
					self.stopInterval();
				}
				else {
					self.fd = fd;
					fs.write(fd, data, null, encoding, (err, written, str) => {
						if (err) {
							self.updateStatus(InstanceStatus.BadConfig, 'Error Opening File');
							self.log('error', 'Error writing file: ' + err);
							self.stopInterval();
						}
						else {
							      self.updateStatus(InstanceStatus.Ok);
							self.checkVariables();
						}
					});
					fs.close(fd);
					self.readFile();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Writing File: ' + error);
		}
	},

	readFileCustom(path, encoding, customVariable) {
		let self = this;

		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					self.log('error', 'Error reading custom file path: ' + err);
				}
				else {
					self.setCustomVariableValue(customVariable, data);
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading custom file path: ' + error);
		}
	},


	readLine(lineNumber, path, customVariable) {
		let self = this;

		let lineIndex = 0;

		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
				self.log('debug', 'Reading Line: ' + lineNumber);
			}

			const fileStream = fs.createReadStream(path);

			const rl = readline.createInterface({
				input: fileStream,
				crlfDelay: Infinity
			});

			rl.on('line', (line) => {
				lineIndex++;
				if (lineIndex == lineNumber) {
					self.setCustomVariableValue(customVariable, line);
					rl.close();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading Line Number: ' + error);
		}
	},

	stopInterval() {
		let self = this; // required to have reference to outer `this`

		if (self.config.verbose) {
			self.log('debug', 'Stopping File Read Interval.');
		}
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}
}
