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
    [Route("CalculateNearestSuburb")]
    public IActionResult CalculateNearestSuburb(Point Point)
    {
        // TODO: refactor CQRS
        // TODO: handle bad input

        var content = FileHelper.ReadAllText("input.json");
        var suburbList =
            JsonSerializer.Deserialize<Suburb[]>(content, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        var nearestSuburb = suburbList!.MinBy(s => CalculateDistance(Point, new Point(s.Latitude, s.Longitude)));

        return Ok(new DistanceResult(
            Point, nearestSuburb, CalculateDistance(Point, nearestSuburb)));
    }

    [HttpGet]
    public IActionResult DistanceTest()
    {
        return CalculateNearestSuburb(new Point(0.2, 0.2));
    }

    // TODO: refactor
    private static double CalculateDistance(Point point, Suburb suburb) =>
        CalculateDistance(point, new Point(suburb.Latitude, suburb.Longitude));

    private static double CalculateDistance(Point a, Point b) =>
        Math.Sqrt(Math.Pow(a.Latitude - b.Latitude, 2) + Math.Pow(a.Longitude - b.Longitude, 2));
}

public record Point(double Latitude, double Longitude);

public record Suburb(
    int Id,
    string SuburbName,
    double Latitude,
    double Longitude
);

public record DistanceResult(Point Point, Suburb Suburb, double Distance);