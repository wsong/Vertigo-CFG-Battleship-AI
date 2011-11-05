function Player1() 
{
    this.TeamName = "[Team KillDashNine]";
    var queue = new Array;
    var backupQueue = new Array;
    var previousX = 0;
    var previousY = 0;

    //OFFENSE: Target selection
    this.SelectTarget = function () {
        prepopulateBackupQueue = function() {
            var i, j;
            while (i < gridx) {
                while (j < gridy) {
                    backupQueue.push([i, j]);
                    j = j + 2;
                }
                i = i + 2;
            }
        }

        randomCoord = function() {
            var coord = new Array;
            coord[0] = Math.floor(Math.random()*(gridx));
            coord[1] = Math.floor(Math.random()*(gridy));
            return coord;
        }
        numKnownSpacesAroundCoord = function(x, y) {
            var xLeftBound = Math.max(x - 2, 0);
            var xRightBound = Math.min(x + 2, gridx);
            var yTopBound = Math.max(y - 2, 0);
            var yBottomBound = Math.min(y + 2, gridy);
            var count = 0;
            var i, j;
            for (i = xLeftBound; i < xRightBound; i++) {
                for (j = yTopBound; j < yBottomBound; j++) {
                    if (opponent[i][j] != "Unknown") {
                        count++;
                    }
                }
            }
            return count;
        }

        pickRandomCoord = function() {
            if (backupQueue.length > 0) {
                var coord = backupQueue.shift();
                while (opponent[coord[0]][coord[1]] != "Unknown"
                       && backupQueue.length > 0) {
                    coord = backupQueue.shift();
                }
                if (opponent[coord[0]][coord[1]] == "Unknown")
                    return coord;
            }
            var possibleCoords = new Array;
            var possibleCoordWeights = new Array;
            var i;
            for (i = 0; i < 10; i++) {
                var randCoord = randomCoord();
                while (opponent[randCoord[0]][randCoord[1]] != "Unknown") {
                    randCoord = randomCoord();
                }
                possibleCoords[i] = randCoord;
            }
            for (i = 0; i < 10; i++) {
                var numKnowns = numKnownSpacesAroundCoord(possibleCoords[i][0], possibleCoords[i][1]);
                possibleCoordWeights[i] = numKnowns;
            }
            var minIndex = 0;
            for (i = 1; i < 10; i++) {
                if (possibleCoordWeights[i] < possibleCoordWeights[minIndex]) {
                    minIndex = i;
                }
            }
            return possibleCoords[minIndex];
        }

        if (opponent[previousX][previousY] == "Hit") {
            var left = Math.max(previousX - 1, 0);
            var right = Math.min(previousX + 1, gridx - 1);
            var top = Math.max(previousY - 1, 0);
            var bottom = Math.min(previousY + 1, gridy - 1);
            if (opponent[left][previousY] == "Unknown") {
                queue.push([left, previousY]);
            }
            if (opponent[right][previousY] == "Unknown") {
                queue.push([right, previousY]);
            }
            if (opponent[previousX][top] == "Unknown") {
                queue.push([previousX, top]);
            }
            if (opponent[previousX][bottom] == "Unknown") {
                queue.push([previousX, bottom]);
            }
        }
        prepopulateBackupQueue();

        if (queue.length == 0) {
            queue.push(pickRandomCoord());
        }

        var firePosition = queue.shift();
        while (opponent[firePosition[0]][firePosition[1]] != "Unknown"
               && queue.length > 0) {
            firePosition = queue.shift();
            if (queue.length == 0) {
                queue.push(pickRandomCoord());
            }
        }
        previousX = firePosition[0];
        previousY = firePosition[1];
        fire(firePosition[0], firePosition[1]);
    }

    //DEFENSE: Ship Placement
    this.SetCustomShipLocations = function () {
        //Returning null yields random ship locations
        return null;

        //Returns ships stacked vertically
        /*
        var ships = [];
        var xposition = 0, yposition = 0;
        var direction = 0;
        var shipid = 0;

        for (shiptypeindex = 0; shiptypeindex < shiptypes.length; shiptypeindex++) 
        {
        for (i = 0; i < shiptypes[shiptypeindex][2]; ++i) 
        {
        ships[shipid] = [shiptypeindex, yposition, xposition, direction];
        shipid++;
        yposition++;
        }        
        }
        return ships;
        */
    }
}