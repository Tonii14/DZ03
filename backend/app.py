from flask import Flask , request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
#app.config['CORS_HEADERS'] = 'Content-Type'

class Line(db.Model):
    __tablename__ = 'Lines'
    id = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(20), nullable=False)
    kompanija = db.Column(db.String(20),  nullable=False)
    dolazak = db.Column(db.String(60), nullable=False)
    polazak = db.Column(db.String(60), nullable=False)

class Flight(db.Model):
    __tablename__ = 'Flights'
    id = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(100), nullable=False)
    vrijemePolaska = db.Column(db.String(60), nullable=False, default=datetime.utcnow)
    vrijemeDolaska = db.Column(db.String(60), nullable=False)
    status = db.Column(db.String(50))
    lineId = db.Column(db.Integer, nullable=False)

class Pasanger(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(100), nullable=False)
    prezime = db.Column(db.String(100), nullable=False)
    klasa = db.Column(db.String(100), nullable=False)
    brojSjedala = db.Column(db.String(100), nullable=False)
    prtljaga = db.Column(db.String(100), nullable=False)
    flightId = db.Column(db.Integer, nullable=False)


@app.route('/editPassenger', methods=['POST'])
def updatePasanger():
    data = request.get_json()
    id = data['idKorisnik']
    ime = data['ime']
    prezime = data['prezime']
    klasa = data['klasaKarte']
    brojSjedala = data['brojSjedala']
    prtljaga = data['prtljaga']
    flightId = data['idLeta']
    questionablePasanger = Pasanger.query.filter(Pasanger.flightId ==flightId, Pasanger.brojSjedala==brojSjedala).first()
    if(questionablePasanger):
         return "Mjesto zauzeto"
    pasangerToUpdate = Pasanger.query.get_or_404(id)
    if request.method == "POST":
        pasangerToUpdate.ime = ime
        pasangerToUpdate.prezime = prezime
        pasangerToUpdate.klasa = klasa
        pasangerToUpdate.brojSjedala = brojSjedala
        pasangerToUpdate.prtljaga = prtljaga
        pasangerToUpdate.flightId = flightId
        try:
            db.session.commit()
            return "success"
        except:
            return "ERROR"
    else:
        return "SOMETHIGN STRANCE"
    
@app.route('/deletePassenger', methods=['POST'])
def deletePasanger():
    data = request.get_json()
    id = data['idKorisnik']
    pasangerToDelete = Pasanger.query.get_or_404(id)
    try:
            db.session.delete(pasangerToDelete)
            db.session.commit()
            return "success"
    except:
            return "ERROR"
    
@app.route('/addPassenger', methods=['POST'])
def addPasanger():
    data = request.get_json()
    ime = data['ime']
    prezime = data['prezime']
    klasa = data['klasaKarte']
    brojSjedala = data['brojSjedala']
    prtljaga = data['prtljaga']
    flightId = data['idLeta']
    questionablePasanger = Pasanger.query.filter(Pasanger.flightId ==flightId, Pasanger.brojSjedala==brojSjedala).first()
    if(questionablePasanger):
         return "Mjesto zauzeto"
    newPassanger = Pasanger(ime=ime, prezime=prezime, klasa=klasa, brojSjedala=brojSjedala, prtljaga=prtljaga, flightId=flightId)
    try:
        db.session.add(newPassanger)
        db.session.commit()
        return "success"
    except:
        return "ERROR"
    
@app.route('/pasanger', methods=['GET'])
def getPasanger():
    passangers = Pasanger.query.order_by(Pasanger.id)
    string = '{'
    putnici = []
    content = {}
    for passanger in passangers :
        content = {'id': passanger.id, 'ime':passanger.ime, 'prezime': passanger.prezime, 'klasa': passanger.klasa, 'brojSjedala' : passanger.brojSjedala,
                   'prtljaga': passanger.prtljaga, 'flightId': passanger.flightId}
        putnici.append(content)
    return jsonify(putnici)

@app.route('/getPassengersByFlightId', methods=['POST'])
def getPasangerOnFlight():
    data = request.get_json()
    flightId = data['idLeta']
    passangers = Pasanger.query.filter(Pasanger.flightId == flightId)
    string = '{'
    putnici = []
    content = {}
    for passanger in passangers :
        content = {'idKorisnik': passanger.id, 'ime':passanger.ime, 'prezime': passanger.prezime, 'klasaKarte': passanger.klasa, 'brojSjedala' : passanger.brojSjedala,
                   'prtljaga': passanger.prtljaga, 'flightId': passanger.flightId}
        putnici.append(content)
    return jsonify(putnici)

@app.route('/getLines', methods=['GET'])
def getLines():
    lines = Line.query.order_by(Line.id)
    linije = []
    content = {}
    for line in lines :
        content = {'idLinije': line.id, 'naziv':line.naziv, 'kompanija': line.kompanija, 'zracnaLukaDolaska': line.dolazak, 'zracnaLukaPolaska' : line.polazak}
        linije.append(content)
    return jsonify(linije)

@app.route('/addLine', methods=['POST'])
def addLine():
    data = request.get_json()
    naziv = data['naziv']
    kompanija = data['kompanija']
    dolazak = data['zracnaLukaDolaska']
    polazak = data['zracnaLukaPolaska']
    newLine = Line(naziv=naziv, kompanija=kompanija, dolazak=dolazak, polazak=polazak)
    try:
        db.session.add(newLine)
        db.session.commit()
        return "success"
    except:
        return "ERROR"
    
@app.route('/deleteLineById', methods=['POST'])
def deleteLine():
    data = request.get_json()
    id = data['idLinije']
    lineToDelete = Line.query.get_or_404(id)
    try:
            db.session.delete(lineToDelete)
            db.session.commit()
            return "success"
    except:
            return "ERROR"
    
@app.route('/editLine', methods=['POST'])
def updateLine():
    data = request.get_json()
    naziv = data['naziv']
    kompanija = data['kompanija']
    dolazak = data['zracnaLukaDolaska']
    polazak = data['zracnaLukaPolaska']
    id = data['idLinije']
    lineToUpdate = Line.query.get_or_404(id)
    if request.method == "POST":
        lineToUpdate.naziv = naziv
        lineToUpdate.kompanija = kompanija
        lineToUpdate.dolazak = dolazak
        lineToUpdate.polazak = polazak
        try:
            db.session.commit()
            return "success"
        except:
            return "ERROR"
    else:
        return "SOMETHIGN STRANCE"
    
@app.route('/editFlight', methods=['POST'])
def updateFlight():
    data = request.get_json()
    naziv = data['naziv']
    if (not(len(naziv) == 7 and naziv[0].isalpha() and naziv[1].isalpha() and naziv[2].isdigit() and naziv[3].isdigit() and naziv[4].isdigit() and naziv[5].isdigit() and naziv[6].isdigit())):
         return 'Format naziva leta je pogresan'
    vrijemePolaska = data['vrijemePolazak']
    vrijemeDolaska = data['vrijemeDolazak']
    status = data['status']
    lineId = data['idLinije']
    id = data['idLeta']
    flightToUpdate = Flight.query.get_or_404(id)
    if request.method == "POST":
        flightToUpdate.naziv = naziv
        flightToUpdate.vrijemePolaska = vrijemePolaska
        flightToUpdate.vrijemeDolaska = vrijemeDolaska
        flightToUpdate.status = status
        flightToUpdate.lineId = lineId
        try:
            db.session.commit()
            return "success"
        except:
            return "ERROR"
    else:
        return "SOMETHIGN STRANCE"
    
@app.route('/deleteFlight', methods=['POST'])
def deleteFlight():
    data = request.get_json()
    id = data['idLeta']
    flightToDelete = Flight.query.get_or_404(id)
    try:
            db.session.delete(flightToDelete)
            db.session.commit()
            return "success"
    except:
            return "ERROR"
    
@app.route('/addFlight', methods=['POST'])
def addFlight():
    data = request.get_json()
    naziv = data['naziv']
    if (not(len(naziv) == 7 and naziv[0].isalpha() and naziv[1].isalpha() and naziv[2].isdigit() and naziv[3].isdigit() and naziv[4].isdigit() and naziv[5].isdigit() and naziv[6].isdigit())):
        return 'Format naziva leta je pogresan'
    vrijemePolaska = data['vrijemePolaska']
    vrijemeDolaska = data['vrijemeDolaska']
    status = data['status']
    lineId = data['idLinije']
    newFlight = Flight(naziv=naziv, vrijemePolaska=vrijemePolaska, vrijemeDolaska=vrijemeDolaska, status=status, lineId=lineId)
    try:
        db.session.add(newFlight)
        db.session.commit()
        return "success"
    except:
        return "ERROR"
    
@app.route('/getFlights', methods=['GET'])
def getFlights():
    flights = Flight.query.order_by(Flight.id)
    linije = []
    content = {}
    for flight in flights :
        content = {'idLeta': flight.id, 'naziv':flight.naziv, 'vrijemePolaska': flight.vrijemePolaska, 'vrijemeDolaska': flight.vrijemeDolaska, 'status' : flight.status, 'lineId': flight.lineId}
        linije.append(content)
    return jsonify(linije)

@app.route('/getFlightsByLineId', methods=['POST'])
def getFlightsOnLine():
    data = request.get_json()
    id = data['idLinije']
    flights = Flight.query.filter(Flight.lineId == id)
    string = '{'
    letovi = []
    content = {}
    for flight in flights :
        content = {'idLeta': flight.id, 'naziv':flight.naziv, 'vrijemePolazak': flight.vrijemePolaska, 'vrijemeDolazak': flight.vrijemeDolaska, 'status' : flight.status, 'idLinije': flight.lineId}
        letovi.append(content)
    return jsonify(letovi)

if __name__ == '__main__':
    app.run(debug=True)