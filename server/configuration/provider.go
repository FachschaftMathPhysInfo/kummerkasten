package configuration

var systemConfiguration Configuration

func Get() Configuration {
	return systemConfiguration
}

func Init() {
	loadConfigurationFromJson()
	loadConfigurationFromEnv()
	loadMissingConfigurationValues()

	loadIntoGlobalStruct()
	validateConfiguration()

	applyLogLevel()
}

type Configuration struct {
	Admin struct {
		Mail     string `koanf:"mail"`
		Password string `koanf:"password"`
	} `koanf:"admin"`
	Database struct {
		Host     string `koanf:"host"`
		Port     string `koanf:"port"`
		User     string `koanf:"user"`
		Password string `koanf:"password"`
		Name     string `koanf:"db"`
	} `koanf:"database"`
	System struct {
		Domain   string `koanf:"domain"`
		Mode     string `koanf:"mode"`
		Pepper   string `koanf:"pepper"`
		LogLevel string `koanf:"loglevel"`
		Frontend struct {
			DefaultLanguage string `koanf:"default_language"`
			MaxInputs       struct {
				Public struct {
					Title   int `koanf:"title"`
					Content int `koanf:"content"`
				} `koanf:"public"`
				Private struct {
					Titles int `koanf:"titles"`
					Labels int `koanf:"labels"`
					Names  int `koanf:"names"`
					Faqs   struct {
						Questions int `koanf:"questions"`
						Answers   int `koanf:"answers"`
					} `koanf:"faqs"`
					About int `koanf:"about"`
				} `koanf:"private"`
			} `koanf:"max_inputs"`
		} `koanf:"frontend"`
	} `koanf:"system"`
}
