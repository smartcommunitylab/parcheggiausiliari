package eu.trentorise.smartcampus.parcheggiausiliari.activity.adapters;

import java.util.Date;
import java.util.List;
import java.util.Map;

import smartcampus.vas.parcheggiausiliari.android.R;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import eu.trentorise.smartcampus.parcheggiausiliari.model.Parking;
import eu.trentorise.smartcampus.parcheggiausiliari.model.Street;

/**
 * Adapter used for populating the {@link ListView} by converting the {@link Map} recieved (because of the mixed types of Data) into a {@link Parking} or a {@link Street}
 * @author Michele Armellini
 *
 */
public class MyStoricoAdapter extends ArrayAdapter<Map> {
	private final Context context;
	private final List<Map> values;

	public MyStoricoAdapter(Context context, List<Map> values) {
		super(context, R.layout.storicorow, values);
		this.context = context;
		this.values = values;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		LayoutInflater inflater = (LayoutInflater) context
				.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		View rowView = inflater.inflate(R.layout.storicorow, parent, false);
		TextView textView = (TextView) rowView
				.findViewById(R.id.storicotitle);
		TextView valFree = (TextView) rowView.findViewById(R.id.valueFree);
		TextView valWork = (TextView) rowView.findViewById(R.id.valueWork);

		TextView valPay;
		TextView valTime;

		Date d = new Date((Long) values.get(position).get("time"));
		textView.setText(((Map) values.get(position).get("value"))
				.get("name")
				+ " - ore "
				+ String.format("%02d", d.getHours())
				+ ":"
				+ String.format("%02d", d.getMinutes())
				+ " - "
				+ String.format("%02d", d.getDate())
				+ "/"
				+ String.format("%02d", (d.getMonth() + 1))
				+ "/"
				+ (d.getYear() + 1900));

		if (((Map) values.get(position).get("value"))
				.containsKey("slotsTotal")) {
			rowView.findViewById(R.id.txtStreet).setVisibility(View.GONE);
			Parking p = populateParking((Map) values.get(position).get(
					"value"));
			valFree.setText("" + p.getSlotsOccupiedOnTotal());
			valWork.setText("" + p.getSlotsUnavailable());
		} else {
			rowView.findViewById(R.id.txtStreet)
					.setVisibility(View.VISIBLE);
			valPay = (TextView) rowView.findViewById(R.id.valuePay);
			valTime = (TextView) rowView.findViewById(R.id.valueTime);
			Street s = populateStreet((Map) values.get(position).get(
					"value"));
			valFree.setText("" + s.getSlotsOccupiedOnFree());
			valWork.setText("" + s.getSlotsUnavailable());
			valTime.setText("" + s.getSlotsOccupiedOnTimed());
			valPay.setText("" + s.getSlotsOccupiedOnPaying());
		}
		return rowView;
	}

	/**
	 * Method to convert a {@link Map} into a {@link Parking}
	 * @param m map to convert
	 * @return the Parking with values obtained from the map
	 */
	public Parking populateParking(Map m) {
		Parking p = new Parking();
		p.setSlotsTotal((Integer) m.get("slotsTotal"));
		p.setSlotsOccupiedOnTotal((Integer) m.get("slotsOccupiedOnTotal"));
		p.setSlotsUnavailable((Integer) m.get("slotsUnavailable"));
		return p;
	}

	/**
	 * Method to convert a {@link Map} into a {@link Street}
	 * @param m map to convert
	 * @return the Parking with values obtained from the map
	 */
	public Street populateStreet(Map m) {
		Street s = new Street();
		s.setSlotsFree((Integer) m.get("slotsFree"));
		s.setSlotsOccupiedOnFree((Integer) m.get("slotsOccupiedOnFree"));
		s.setSlotsUnavailable((Integer) m.get("slotsUnavailable"));
		s.setSlotsOccupiedOnPaying((Integer) m.get("slotsOccupiedOnPaying"));
		s.setSlotsPaying((Integer) m.get("slotsPaying"));
		s.setSlotsOccupiedOnTimed((Integer) m.get("slotsOccupiedOnTimed"));
		s.setSlotsTimed((Integer) m.get("slotsTimed"));
		return s;
	}
}