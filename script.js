let data = [];

function createGraph(data) {
  const chartContainer = document.getElementById("chart");

  data.sort((a, b) => new Date(a.followed_at) - new Date(b.followed_at));

  const timestamps = data.map((follower) => new Date(follower.followed_at));
  const followerCounts = data.map((follower, index) => [
    timestamps[index],
    index + 1,
  ]);

  const names = data.map((follower) => follower.from_name);

  Plotly.newPlot(
    chartContainer,
    [
      {
        x: timestamps,
        y: followerCounts.map((count) => count[1]),
        mode: "lines",
        line: { shape: "spline" },
        hovertemplate:
          "<b>%{text}</b><br>Date: %{x|%Y-%m-%d}<br>Followers: %{y}",
        text: names,
      },
    ],
    {
      title: "Twitch Follower Graph",
      xaxis: {
        title: "Time",
        type: "date",
      },
      yaxis: {
        title: "Follower Count",
      },
    }
  );
}

function searchUser() {
  const chartContainer = document.getElementById("chart");
  const searchInput = document.getElementById("searchInput");
  const username = searchInput.value.trim().toLowerCase();

  const index = data.findIndex(
    (follower) => follower.from_name.toLowerCase() === username
  );

  if (index !== -1) {
    Plotly.Fx.hover(chartContainer, [{ curveNumber: 0, pointNumber: index }]);
  } else {
    console.log("Username not found");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("followers.json")
    .then((response) => response.json())
    .then((jsonData) => {
      data = jsonData;
      createGraph(data);
    })
    .catch((error) =>
      console.error("Error occurred while loading follower data:", error)
    );

  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", searchUser);
});
