using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using FileHelper = System.IO.File;
namespace aspnet_api.Controllers;

[ApiController]
[Route("suburb")]
public class SuburbController : ControllerBase
{
    private readonly ILogger<SuburbController> _logger;

    public SuburbController(ILogger<SuburbController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public IActionResult GetDistance(double latitude, double longitude)
    {
        // TODO: refactor using MediatR CQRS

        var content = FileHelper.ReadAllText("input.json");
        var array = JsonSerializer.Deserialize<Suburb>(content);
        Console.WriteLine(content);


        return BadRequest("File upload failed");
    }
}

record Suburb(int Id, string SuburbName, double Latitude, double Longitude);