namespace :import do
  desc "Lädt alle Mathe und Informatikveranstaltungen aus dem LSF"
  task math: :environment do
    LSFParser.import(["Mathematik und Informatik"])
  end

  desc "Lädt alle Physikveranstaltungen aus dem LSF"
  task physics: :environment do
    LSFparser.import(["Physik und Astronomie"])
  end

  desc "Lädt alle Veranstaltungen aus dem LSF"
  task all: :environment do
    LSFparser.import_all()
  end

end
