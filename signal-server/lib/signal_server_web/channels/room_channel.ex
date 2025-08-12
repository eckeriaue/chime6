# lib/signal_server_web/channels/room_channel.ex
defmodule SignalServerWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:" <> room_id, _params, socket) do
    {:ok, assign(socket, :room_id, room_id)}
  end

  def handle_in("offer", %{"sdp" => sdp, "to" => _to}, socket) do
    broadcast!(socket, "offer", %{"sdp" => sdp, "from" => socket.assigns.room_id})
    {:reply, :ok, socket}
  end

  def handle_in("answer", payload, socket), do: broadcast!(socket, "answer", payload)
  def handle_in("ice_candidate", payload, socket), do: broadcast!(socket, "ice_candidate", payload)
end
