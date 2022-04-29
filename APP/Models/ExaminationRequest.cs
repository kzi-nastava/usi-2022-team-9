using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

public class ExaminationRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("_id")]
    public string? _id { get; set; }
    
    [BsonElement("examination")]
    [JsonPropertyName("examination")]
    public Examination examination {get; set;}

    [BsonElement("status")]
    [JsonPropertyName("status")]
    public int status {get; set;}
}