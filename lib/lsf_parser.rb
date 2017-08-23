require 'net/http'
require 'rexml/document'
class LSF
    # URL to LSF Service
  #  HOST_URL="http://lsf.uni-heidelberg.de/axis2/services/LSFService/"
  HOST_URL="https://his.uni-heidelberg.de/axis2/services/LSFService/"

  # Points to the HTML serving component of the LSF, as the LSFService
  # doesn’t seem to include a search function. Replace SURNAME, LECTURE
  # and TERM with the desired values to get a valid search URL that can
  # be processed further.
  SEARCH_URL="http://lsf.uni-heidelberg.de/qisserver/rds?state=wsearchv&search=1&subdir=veranstaltung&personal.nachname=SURNAME&veranstaltung.dtxt=LECTURE&veranstaltung.semester=TERM&_form=display"

  # points to the root of the HTTP tree
  TOPLEVEL="http://lsf.uni-heidelberg.de/qisserver/rds?state=wtree&search=1&category=veranstaltung.browse&topitem=lectures&subitem=lectureindex&breadcrumb=lectureindex"

  # When finding suitable HTML tree URLs, this will be prepended in
  # order to get a full and correct address.
  BASELINK="http://lsf.uni-heidelberg.de/qisserver/rds?state=wtree&search=1&trex=step&P.vx=mittel&"

  # Used to look for the faculty’s name
  FACULTY="http://lsf.uni-heidelberg.de/qisserver/rds?state=verpublish&status=init&vmfile=no&moduleCall=webInfo&publishConfFile=webInfoEinrichtung&publishSubDir=einrichtung&einrichtung.eid="
  def self.load_url(url)
    #NOTE quick'n'dirty HTTPS connect because the LSF service changed
    #NOTE to HTTPS. This can be done much prettier w/ URL autodetection
    #NOTE or stuff
    uri = URI.parse(URI.encode(url))
    http = Net::HTTP.new(uri.host, 443)
    http.use_ssl = true
    request = Net::HTTP::Get.new(uri.request_uri)
    response = http.request(request)
    req = response

    unless req.is_a?(Net::HTTPSuccess)
      warn "Sorry, couldn’t load LSF :("
      warn "URL: #{url}"
      warn "error: #{req.error}"
      req.error!
    end
    # Net::HTTP always returns ASCII-8BIT encoding although the webpage
    # is delivered in UTF-8. Try to read encoding from the headers and
    # use that.
    enc = req.get_fields("content-type").join.match(/charset=([a-z0-9-]+)/i)
    return req.body.force_encoding(enc[1]).gsub(/\s+/, " ")
  end
  # Returns the root links matching the given strings. One hash in the
  # form of { :url => "", :title => "" } is returned for each search
  # item. If there are multiple matches for a string, only the first is
  # returned.
  # Finds URLs in the given (HTML) LSF URL that can be used to further
  # travel down the tree. If no link is given, starts from the top
  # level. Returns results in the form of [{ :url => "", :title => "" }]
  def self.find_suitable_urls(link = TOPLEVEL)
    puts "Now checking #{link}"

    dec = LSF.load_url(link)
    dec = dec.scan(/state=wtree&amp;search=1&amp;trex=step&amp;(root[0-9][^&]+)[^"]+"\s+title="'([^']+)'/)
    dec.map! { |d| { :url => BASELINK + d[0], :title => d[1] } }
    # find depth by counting the bar seperators and only keep links that
    # go deeper
    depth = link.scan("|").count
    dec.reject! { |d| d[:url].scan("|").count <= depth }
    dec
  end
  def self.find_certain_roots(search)
    raise "Search needs to be an Array" unless search.is_a?(Array)
    urls = LSF.find_suitable_urls
    return *search.map { |s| urls.detect { |x| x[:title].include?(s) } }
  end
  # extracts term and root id from the given URL and stores it as class
# variables. These IDs are required to bootstrap the recursive
# tree-walk. Also returns them as term, rootid.
  def self.set_term_and_root(link)
    ids = link.scan(/root[0-9]([0-9]{5})=(?:[0-9]{5,}\|)+([0-9]{5,})/)
    @@term = ids[0][0].to_i
    @@rootid = ids[0][1].to_i
    return @@term, @@rootid
  end
  # completes professor information for the given ID and name. Name must
    # be supplied externally because the current API does not support a
    # query that contains all professor details.
    def self.get_prof(id)
      return @@cache_profs[id] unless @@cache_profs[id].nil?
      puts "Reading Professor Details: #{id}"
      root = LSF.load_xml("getDet?pid=#{id}")
      root.remove_namespaces!
      root2 = LSF.load_xml("getKontakt?pid=#{id}")
      root2.remove_namespaces!
      p={
      :first => root.at_xpath("//vorname").content(),
      :last => root.at_xpath("//nachname").content(),
      :title => root.at_xpath("//titel").content(),
      :akad => root.at_xpath("//akadgrad").content(),
      :mail => root2.at_xpath("//email").content(),
      :tele => root2.at_xpath("//telefon").content(),
      :id => Integer(root2.at_xpath("//kid").content()),
      :geschlecht =>root.at_xpath("//geschl").content()
    }
      @@cache_profs[id] = p
      p
    end
    @@cache_profs = {}
  # Gets a list of professors associated with the given prof group id.
# It depends on the lecture as well as the time, as a single lecture
# may be given by multiple profs.
def self.get_profs(id)
  root = LSF.load_xml('getDozenten?vtid=' + id.to_s)
  profs = root.xpath("//ns:return").flat_map { |p| LSF.get_prof(p.at_xpath("//ax23:id").content()) }

  profs.compact!
  # Remove duplicate lectures
  profs.uniq! { |l| l[:id] }
  profs
end
  # Will read available details for the given lecture id. Returns Hash.
  def self.get_lecture_details(id)
    p ("Reading lecture details: #{id}")
    root = LSF.load_xml("getVerDet?vid=#{id}")
    termine = LSF.load_xml("getTermine?vid=#{id}")
    profs= termine.xpath("//ns:return").flat_map do |ldat|
      get_profs(ldat.at_xpath("//ax23:vtid").content())
    end
    profs.compact!
    # Remove duplicate lectures
    profs.uniq! { |l| l[:id] }
    return {} if root.at_xpath("//ax23:sws").nil?
    {
      :id       => id,
      :sws      => root.at_xpath("//ax23:sws").content().to_i,
      :lang     => root.at_xpath("//ax23:unterrsprache").content(),
      :type     => root.at_xpath("//ax23:verart").content(),
      :link     => root.at_xpath("//ax23:hyperlink").content(),
      :name     => root.at_xpath("//ax23:dtxt").content(),
      :facul    => "Fakultät",
      :facul_name    => "Fakultätsname",
      :profs    => profs
    }
  end
  # Loads a lecture and all details if given an ID. Returns lecture
  # first, and a boolean if the lecture should be ignored (i.e. stop
  # type occured type occured or incomplete data). Does not include
  # faculty.
  def self.get_lecture(id)
    return nil, true if id.to_s.empty? || id.to_s == "0"
    puts ("Reading lecture: #{id}")
    @@level += 1
    l = LSF.get_lecture_details(id)

    skip = !l[:type].nil?
    skip = skip || l[:name].nil?
    # skip lectures that neither has time/rooms/prof nor SWS information
    @@level -= 1
    p l
    return l
  end
  def self.facul_id_to_name(id)
    load_url(FACULTY + id.to_s).match(/<h2>(.*?)<\/h2>/)[0].strip_html rescue ""
  end
  # Finds all the events in a given branch/subtree id. Only the last
  # branch contains events.
  def self.get_lectures(id)
    puts "Reading Lecture List #{id}"
    @@level += 1
    root = LSF.load_xml("getVorl?ueid=#{id}")
    l = root.xpath("//ns:return").flat_map do |ldat|
      lect = LSF.get_lecture(ldat.at_xpath("ax23:vorID").content())
      lect[:facul] = ldat.at_xpath("ax23:eid").content()
      lect[:facul_name] = LSF.facul_id_to_name(lect[:facul])
      lect
    end.compact
    @@level -= 1
    puts "getLectures"
    p l
    l
  end
  # Takes a "root id" as argument and recursively parses the LSF tree
# down to the event level
def self.get_tree(id, processed_trees = [])
  puts "Loading Tree: #{id}"

  if processed_trees.empty?
    @@level = 1
  else
    @@level += 1
  end

  if processed_trees.include?(id)
    puts "Tree #{id} has already been covered, skipping"
    return []
  end
  processed_trees << id

  root = LSF.load_xml("getUeberschr?ueid=#{id}&semester=#{LSF.term}")
  lectures = []
  # If the branch has sub branches, then read them
  p root.xpath("//ns:return").size
  #o = gets.chomp
  if (root.elements.size >= 1)&&(root.elements.first.elements.size>=1)
    p root.elements
    root.xpath("//ns:return").flat_map do |subtree|
      p subtree
      subid = subtree.at_xpath("ax23:id")
      next if subid.nil?
      puts "Reading Subtree: #{subid.content()}"
      lectures += LSF.get_tree(subid.content(), processed_trees)
    end
  # Otherwise get list of lectures in that leaf.
  else
    puts "Found leaf at #{id}. Reading lectures."
    #o= gets.chomp
    lectures += LSF.get_lectures(id)
  end
  # Remove bogus lectures
  lectures.compact!
  # Remove duplicate lectures
  lectures.uniq! { |l| l[:id] }
  lectures
end
# helper methods
# Tries to guess the current term by looking at the date. Assumes
  # summer term is from March, 1st  to August, 31th.
  def self.guess_term
    y = Time.now.year
    # terms overlap on March, 1st. This shouldn’t be a problem though,
    # since we only need the latter to correct the year value and not
    # to determine if it’s summer/winter.
    term_summer = Date.new(y, 3, 1)..Date.new(y, 8, 31)
    term_winter_newyear = Date.new(y, 1, 1)..Date.new(y, 3, 1)

    summer = term_summer.include?(Date.today)
    # if we’re in winter term, but already celebrated new years…
    y -= 1 if !summer && term_winter_newyear.include?(Date.today)
    "#{y}#{summer ? 1 : 2}"
  end
# returns the term as either set manually or guessed.
  def self.term
    @@term || LSF.guess_term
  end
  @@cache_xml = {}
  # Reads and parses the XML file as returned by LSF Service. Returns an
  # XML document
  def self.load_xml(parameters)
    url = HOST_URL + parameters
    return @@cache_xml[url] if @@cache_xml[url]
    puts "Lade "+url
    @@cache_xml[url]=Nokogiri::XML(LSF.load_url(url))
    @@cache_xml[url]
  end
  def self.process(courses, title,semester)
    i=0
    courses.each do |course|
      puts "Importiere #{i}/#{courses.size}"
      i+=1
      if Course.find_by(lsf_id:course[:id]).nil?
        p course
        ct = Coursetype.find_by(name:course[:type])
        ct= Coursetype.create(name: course[:type]) if ct.nil?
        fk = Faculty.find_by(lsf_id:course[:facul])
        fk= Faculty.create(lsf_id:course[:facul],name: title) if fk.nil?
        c=Course.create(lsf_id:course[:id],name:course[:name],coursetype:ct,faculty:fk,semester:semester)
        c.save!
        course[:profs].each do |prof|
          pr= Lecturer.find_by(lsf_id:prof[:id])
          anrede = prof[:geschlecht]=="W"? "Sehr geehrte Frau":"Sehr geehrter Herr"
          p anrede
          pr =Lecturer.create(lsf_id:prof[:id],salutation: "#{anrede} #{prof[:title]}",surname: prof[:last],givenname:prof[:first],email:prof[:mail]) if pr.nil?
          pr.save!
          Lecture.create(course:c,lecturer:pr).save()
        end
    end
  end
  end
  ##
  # Imports faculties by name, current term
  ##
  def self.import(names)
    roots = find_certain_roots(names)
    roots.each do |faculty|
      term,root = set_term_and_root(faculty[:url])
      p term
      sems= Semester.find_by(lsf_id:term)
      sems = Semester.create(lsf_id:term,name:term.to_s[4]=="1" ? "Sommersemester ":"Wintersemester "+term.to_s[0..3]) if sems.nil?
      courses = get_tree(root)
      process(courses,faculty[:title],sems)
    end
  end
  def self.import_all()
    p find_suitable_urls
    find_suitable_urls().each do |url|
      term,root = set_term_and_root(url[:url])
      sems= Semester.find_by(lsf_id:term)
      sems = Semester.create(lsf_id:term,name:term.to_s[4]=="1" ? "Sommersemester ":"Wintersemester "+term.to_s[0..3]) if sems.nil?
      courses = get_tree(root)
      process(courses,faculty[:title],sems)
    end
  end
end
