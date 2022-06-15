using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class MedicalRecordController : ControllerBase
{
    private IMedicalRecordService _medicalRecordService;

    public MedicalRecordController()
    {
        _medicalRecordService = new MedicalRecordService();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicalRecord(int id, MedicalRecord medicalRecord)
    {
        await _medicalRecordService.UpdateMedicalRecord(id, medicalRecord);

        return Ok();
    }

    [HttpPut("persrciption/{id}")]
    public async Task<IActionResult> AddPerscriptionToMedicalRecord(int id, Prescription prescription)
    {
        if (await _medicalRecordService.IsPerscriptionValid(id, prescription))
        {
            await _medicalRecordService.UpdatePatientsPerscriptionList(id, prescription);

            return Ok();
        }

        return BadRequest();
    }
    [HttpGet("prescription/{id}")]
    public async Task<List<MedicalInstruction>> GetPrescriptions(int id){

        return await _medicalRecordService.GetPrescriptions(id);
    }


    [HttpGet("prescription/{drug}/{id}")]
    public async Task<Prescription> GetPrescription(string drug, int id){

        return await _medicalRecordService.GetPrescription(drug, id);
    }

}