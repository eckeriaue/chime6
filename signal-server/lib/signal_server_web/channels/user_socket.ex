defmodule SignalServerWeb.UserSocket do
  use Phoenix.Socket

  channel "room:*", SignalServerWeb.RoomChannel

  def connect(params, socket) do
    case params["vsn"] do
      "2.0.0" -> {:ok, socket}
      _ -> :error
    end
  end

  def id(_socket), do: nil
end
