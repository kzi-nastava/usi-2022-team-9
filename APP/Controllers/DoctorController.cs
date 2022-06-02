#nullable disable
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class DoctorController : ControllerBase
{
    private IMongoDatabase database;
    public DoctorController()
    {
        var settings = MongoClientSettings.FromConnectionString("mongodb+srv://admin:admin@cluster0.ctjt6.mongodb.net/USI?retryWrites=true&w=majority");
        var client = new MongoClient(settings);
        database = client.GetDatabase("USI");
    }

    // [HttpGet("examinations")]
    // public async Task<List<Examination>> GetAllExaminations()
    // {
    //     var examinations = database.GetCollection<Examination>("MedicalExaminations");

    //     return examinations.Find(e => true).ToList();
    // }

    // [HttpGet("examinations/nextIndex")]
    // public async Task<Examination> GetNextExaminationsIndex()
    // {
    //     var examinations = database.GetCollection<Examination>("MedicalExaminations");

    //     return examinations.Find(e => true).SortByDescending(e => e.Id).FirstOrDefault();
    // }

    // [HttpGet("examinations/doctorId/{id}")]
    // public async Task<List<Examination>> GetDoctorsExaminations(int id)
    // {
    //     var examinations = database.GetCollection<Examination>("MedicalExaminations");

    //     return examinations.Find(e => e.DoctorId == id).ToList();
    // }

    // [HttpGet("examinations/patientId/{id}")]
    // public async Task<List<Examination>> GetPatientsExaminations(int id)
    // {
    //     var examinations = database.GetCollection<Examination>("MedicalExaminations");

    //     return examinations.Find(e => e.PatinetId == id).ToList();
    // }

    // [HttpGet("examinations/patientMedicalCard/{id}")]
    // public async Task<MedicalCard> GetPatientMedicalCard(int id)
    // {
    //     var patients = database.GetCollection<MedicalCard>("Patients");
    //     MedicalCard resultingMedicalCard = patients.Find(p => p.Id == id).FirstOrDefault();

    //     return resultingMedicalCard;
    // }

    // [HttpGet("examinations/room/{name}")]
    // public async Task<Room> GetExaminationRoom(string name)
    // {
    //     var rooms = database.GetCollection<Room>("Rooms");
    //     Room resultingRoom = rooms.Find(r => r.Name == name).FirstOrDefault();

    //     return resultingRoom;
    // }

    // [HttpGet("drugs")]
    // public async Task<List<Drug>> GetDrugsForReview()
    // {
    //     var drugs = database.GetCollection<Drug>("Drugs");

    //     return drugs.Find(item => item.Status == "inReview").ToList();
    // }

    // public bool IsRoomOccupied(string examinationRoomName, string dateAndTimeOfExamination, int durationOfExamination, int id){
    //     var examinations = database.GetCollection<Examination>("MedicalExaminations");
    //     var possiblyOccupiedRooms = examinations.Find(item => true).ToList();

    //     foreach (Examination item in possiblyOccupiedRooms){
    //         if(item.RoomName == examinationRoomName){
    //             DateTime itemBegin = DateTime.Parse(item.DateAndTimeOfExamination);
    //             DateTime itemEnd = itemBegin.AddMinutes(item.DurationOfExamination);
    //             DateTime examinationBegin = DateTime.Parse(dateAndTimeOfExamination);
    //             DateTime examinationEnd = examinationBegin.AddMinutes(durationOfExamination);
    //             if(examinationBegin >= itemBegin && examinationBegin <= itemEnd || examinationEnd >= itemBegin && examinationEnd <= itemEnd){
    //                 if(id != item.Id )return true;
    //             }
    //         }  
    //     }
    //     return false;
    // }

    // public bool IsRoomValid(string roomName){
    //     var rooms = database.GetCollection<Room>("Rooms");
    //     var resultingRoom = rooms.Find(r => r.Name == roomName && r.InRenovation == false);
    //     if(resultingRoom == null){
    //         return false;
    //     }
    //     return true;
    // }

    // public bool IsValidPatient(int id){
    //     var patients = database.GetCollection<Patient>("Patients");
    //     var resultingPatient = patients.Find(p => p.Id == id).FirstOrDefault();
    //     if(resultingPatient == null){
    //         return false;
    //     }
    //     return true;
    // }

    // public bool IsRoomInRenovation(string roomName, string examinationDate){
    //     var renovations = database.GetCollection<Renovation>("Renovations").Find(renovation => true).ToList();

    //     foreach(Renovation r in renovations){
    //         DateTime renovationBegin = DateTime.Parse(r.StartDate);
    //         DateTime renovationEnd = DateTime.Parse(r.EndDate);
    //         DateTime examinationDateParsed = DateTime.Parse(examinationDate);
    //         if(renovationBegin <= examinationDateParsed && renovationEnd >= examinationDateParsed){
    //             return true;
    //         }
    //     }
    //     return false;

    // }

    // public bool IsPatientFree(int id, string dateAndTimeOfExamination, int durationOfExamination){

    //     var patientsExaminations = database.GetCollection<Examination>("MedicalExaminations").Find(e => e.PatinetId == id).ToList();
    //     return IsPersonFree(id, dateAndTimeOfExamination, durationOfExamination, patientsExaminations);

    // }

    // public bool IsDoctorFree(int id, string dateAndTimeOfExamination, int durationOfExamination){

    //     var doctorsExaminations = database.GetCollection<Examination>("MedicalExaminations").Find(e => e.DoctorId == id).ToList();
    //     return IsPersonFree(id, dateAndTimeOfExamination, durationOfExamination, doctorsExaminations);

    // }

    // public bool IsPersonFree(int id, string dateAndTimeOfExamination, int durationOfExamination, List<Examination> personsExaminations){

    //     foreach(Examination examination in personsExaminations){
    //         DateTime itemBegin = DateTime.Parse(examination.DateAndTimeOfExamination);
    //             DateTime itemEnd = itemBegin.AddMinutes(examination.DurationOfExamination);
    //             DateTime examinationBegin = DateTime.Parse(dateAndTimeOfExamination);
    //             DateTime examinationEnd = examinationBegin.AddMinutes(durationOfExamination);
    //             if((examinationBegin >= itemBegin && examinationBegin <= itemEnd) || (examinationEnd >= itemBegin && examinationEnd <= itemEnd)){
    //                 return false;
    //             }
    //     }
    //     return true;

    // }

    // [HttpPost("examinations")]
    // public async Task<IActionResult> CreateExamination(Examination examination)
    // {
    //     var isValidPatient = IsValidPatient(examination.PatinetId);
    //     var isValidRoom = IsRoomValid(examination.RoomName);
    //     var isOccupiedRoom = IsRoomOccupied(examination.RoomName, examination.DateAndTimeOfExamination, examination.DurationOfExamination, 0);
    //     var isRoomInRenovation = IsRoomInRenovation(examination.RoomName, examination.DateAndTimeOfExamination);
    //     var isPatientFree = IsPatientFree(examination.PatinetId, examination.DateAndTimeOfExamination, examination.DurationOfExamination);
    //     var isDoctorFree = IsDoctorFree(examination.DoctorId, examination.DateAndTimeOfExamination, examination.DurationOfExamination);

    //     if(isValidRoom && isValidPatient && !isRoomInRenovation && !isOccupiedRoom && isPatientFree && isDoctorFree)
    //     {
    //         var examinations = database.GetCollection<Examination>("MedicalExaminations");
    //         var id = examinations.Find(e => true).SortByDescending(e => e.Id).FirstOrDefault().Id;
    //         examination.Id = id + 1;
    //         examinations.InsertOne(examination);

    //         return Ok(); 
    //     }
    //     return BadRequest();
    // }

    // [HttpPut("drugs/{id}")]
    // public async Task<IActionResult> UpdateDrugMessage(string id, Dictionary<string, string> data)
    // {
    //     var drugs = database.GetCollection<Drug>("Drugs");
        
    //     var filter = Builders<Drug>.Filter.Eq("name", id);
    //     var update = Builders<Drug>.Update.Set("comment", data["message"]);
    //     drugs.UpdateOne(filter, update);

    //     return Ok();
    // }

    // [HttpPut("drugs/approve/{id}")]
    // public async Task<IActionResult> ApproveDrug(string id)
    // {
    //     var drugs = database.GetCollection<Drug>("Drugs");
        
    //     var filter = Builders<Drug>.Filter.Eq("name", id);
    //     var update = Builders<Drug>.Update.Set("status", "inUse");
    //     drugs.UpdateOne(filter, update);

    //     return Ok();
    // }

    // [HttpPut("examinations/{id}")]
    // public async Task<IActionResult> UpdateExamination(int id, Examination examination)
    // {
    //     var isValidPatient = IsValidPatient(examination.PatinetId);
    //     var isValidRoom = IsRoomValid(examination.RoomName);
    //     var isOccupiedRoom = IsRoomOccupied(examination.RoomName, examination.DateAndTimeOfExamination, examination.DurationOfExamination, (int) examination.Id);
    //     var isRoomInRenovation = IsRoomInRenovation(examination.RoomName, examination.DateAndTimeOfExamination);
    //     var isPatientFree = IsPatientFree(examination.PatinetId, examination.DateAndTimeOfExamination, examination.DurationOfExamination);
    //     if (isValidRoom && isValidPatient && !isRoomInRenovation && !isOccupiedRoom && isPatientFree)
    //     {
    //         var examinations = database.GetCollection<Examination>("MedicalExaminations");
    //         examinations.FindOneAndReplace(e => e.Id == id, examination);
            
    //         return Ok(); 
    //     } 
    //     return BadRequest();
    // }

    // [HttpPut("examinations/room/{name}")]
    // public async Task<IActionResult> UpdateExaminationRoom(string name, Room room)
    // {
    //     var rooms = database.GetCollection<Room>("Rooms");
        
    //     rooms.FindOneAndReplace(r => r.Name == name, room);
    //     return Ok();    
    // }

    // [HttpPut("examinations/medicalrecord/{id}")]
    // public async Task<IActionResult> UpdateMedicalCard(int id, MedicalRecord medicalRecord )
    // {
    //     var patients = database.GetCollection<Patient>("Patients");
    //     var updatePatients = Builders<Patient>.Update.Set("medicalRecord", medicalRecord);
    //     patients.UpdateOne(p => p.Id == id, updatePatients);
    //     return Ok();    
    // }

    // public int FindReferralId(int patientId){
    //     var patient = database.GetCollection<Patient>("Patients").Find(p => p.Id == patientId).FirstOrDefault();
    //     if(patient.MedicalRecord.Referrals.Count() == 0){
    //         return 1;
    //     }else{
    //         var lastReferralId = (int) patient.MedicalRecord.Referrals.Last().ReferralId;
    //         return lastReferralId + 1;
    //     }      
    // }

    // [HttpPut("examinations/referral/{id}")]
    // public async Task<IActionResult> CreateReferral(int id, MedicalRecord medicalRecord )
    // {
    //     var referralId = FindReferralId(id);
    //     medicalRecord.Referrals.Last().ReferralId = referralId;
    //     var patients = database.GetCollection<Patient>("Patients");
    //     var updatePatients = Builders<Patient>.Update.Set("medicalRecord", medicalRecord);
    //     patients.UpdateOne(p => p.Id == id, updatePatients);
    //     return Ok();    
    // }

    // [HttpDelete("examinations/{id}")]
    // public async Task<IActionResult> DeleteExamination(int id)
    // {
    //     var examinations = database.GetCollection<Examination>("MedicalExaminations");
    //     examinations.DeleteOne(e => e.Id == id);
        
    //     return Ok();
    // }
}

