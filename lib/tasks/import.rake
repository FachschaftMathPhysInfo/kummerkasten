namespace :import do
  desc "Lädt alle Mathe und Informatikveranstaltungen aus dem LSF, lädt Profs ein"
  task math: :environment do
    LSFParser.import(["Mathematik und Informatik"],true)
  end

  desc "Lädt alle Physikveranstaltungen aus dem LSF, lädt Profs ein"
  task physics: :environment do
    LSFParser.import(["Physik und Astronomie"],true)
  end

  desc "Lädt alle Veranstaltungen aus dem LSF"
  task all: :environment do
    LSFparser.import_all()
  end

end
