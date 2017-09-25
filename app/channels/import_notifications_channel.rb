class ImportNotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "import_notifications_channel"
  end
  def start(options)
    p options
    puts "StartingImporting now"
    LSFParser.set_broadcast_status(true)
    ActionCable.server.broadcast 'import_notifications_channel',message: 'Starte Importiervorgang',importing:true

    LSFParser.import_with_ids(options["faculty"],options["term"],options["invite"])
  end
  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
