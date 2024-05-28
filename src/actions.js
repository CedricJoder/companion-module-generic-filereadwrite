module.exports = {

	initActions() {
		let self = this; // required to have reference to outer `this`
		let actions = {};

		actions.readFile = {
			name: 'Read File Now',
			options: [],
			callback: async function (action) {
				self.readFile();
			}
		};

		actions.writeFile = {
			name: 'Write File',
			options: [],
			callback: async function (action) {
				self.writeFile();
			}
		};


		actions.appendFile = {
			name: 'Append writebuffer to File ',
			options: [],
			callback: async function (action) {
				self.appendFile(self.writebuffer);
			}
		};


		actions.appendFileData = {
			name: 'Append Specified Data to File ',
			options: [
				{
					type: 'textinput',
					label: 'Data',
					description: 'Data to write. Accepts variables',
					id: 'data',
					default: '',
					useVariables: true
				},
			],
			callback: async function (action) {
				let data = await self.parseVariablesInString(action.options.data)
				self.appendFile(data);
			}
		};



		actions.setWritebuffer = {
			name: 'Store data into buffer to write file later',
			options: [
				{
					type: 'textinput',
					label: 'Data',
					description: 'Data to store. Accepts variables',
					id: 'data',
					default: '',
					useVariables: true
				},
			],
			callback: async function (action) {
				let data = await self.parseVariablesInString(action.options.data)
				self.setWritebuffer(data);
			}
		};


		actions.readFileCustom = {
			name: 'Read Custom File Path into Custom Variable',
			options: [
				{
					type: 'textinput',
					label: 'File Path',
					description: 'File Path to read. Accepts variables',
					id: 'path',
					default: '',
					useVariables: true
				},
				{
					type: 'dropdown',
					id: 'encoding',
					width: 6,
					label: 'File Encoding',
					default: 'utf8',
					choices: self.ENCODING_TYPES
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read file contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let path = await self.parseVariablesInString(action.options.path)
				self.readFileCustom(path, action.options.encoding, action.options.customVariable);
			}
		};

		actions.readLine = {
			name: 'Read Specific Line',
			options: [
				{
					type: 'textinput',
					label: 'Line Number',
					description: 'Line Number to read. Accepts variables and value must be an integer',
					id: 'line',
					default: '1',
					useVariables: true
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read line contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let line = await self.parseVariablesInString(action.options.line);
				let lineNumber = parseInt(line);
				if (isNaN(lineNumber)) {
					self.log('Line Number must be an integer', 'error');
					return;
				}
				self.readLine(lineNumber, self.config.path, action.options.customVariable);
			}
		};

		actions.readLineCustom = {
			name: 'Read Specific Line of Custom File Path into Custom Variable',
			options: [
				{
					type: 'textinput',
					label: 'Line Number',
					description: 'Line Number to read. Accepts variables and value must be an integer',
					id: 'line',
					default: '1',
					useVariables: true
				},
				{
					type: 'textinput',
					label: 'File Path',
					description: 'File Path to read. Accepts variables',
					id: 'path',
					default: '',
					useVariables: true
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read line contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let line = await self.parseVariablesInString(action.options.line);
				let path = await self.parseVariablesInString(action.options.path);

				let lineNumber = parseInt(line);
				if (isNaN(lineNumber)) {
					self.log('Line Number must be an integer', 'error');
					return;
				}
				self.readLine(lineNumber, path, action.options.customVariable);
			}
		};

		actions.startInterval = {
			name: 'Start Reading File Interval',
			options: [],
			callback: async function (action) {
				self.openFile();
			}
		};

		actions.stopInterval = {
			name: 'Stop Reading File Interval',
			options: [],
			callback: async function (action) {
				self.stopInterval();
			}
		};

		self.setActionDefinitions(actions);
	},
}
