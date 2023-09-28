import FavoriteIcon from "@mui/icons-material/Favorite"

type HealthControllerType = {
  maxPlayerHealth: number
  currentPlayerHealth: number
}

type HealthPiece = {
  position: number
}

export function HealthController({
  maxPlayerHealth,
  currentPlayerHealth,
}: HealthControllerType) {
  const healthArray: HealthPiece[] = []

  for (let i = 0; i < maxPlayerHealth; i += 1) {
    healthArray.push({ position: i + 1 })
  }

  return (
    <div className={maxPlayerHealth > 4 ? "grid grid-cols-5" : "flex gap-5"}>
      {healthArray.map((healthPiece) => (
        <FavoriteIcon
          key={healthPiece.position}
          sx={{
            height: "50px",
            width: "50px",
            color: "red",
            visibility:
              healthPiece.position <= currentPlayerHealth
                ? "visible"
                : "hidden",
          }}
        />
      ))}
    </div>
  )
}
